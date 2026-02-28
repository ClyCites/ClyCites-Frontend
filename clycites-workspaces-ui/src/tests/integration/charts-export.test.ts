import { describe, expect, it } from "vitest";
import { chartService } from "@/lib/api/mock/charts";

describe("Analytics chart and export flows", () => {
  it("supports chart save/update/export and dashboard attach/reorder/report", async () => {
    const chartA = await chartService.saveChart({
      name: "Orders by month",
      description: "Monthly orders",
      definition: {
        datasetId: "market_performance",
        chartType: "line",
        metrics: [{ type: "count", alias: "orders" }],
        dimensions: [{ type: "date_month", alias: "month" }],
      },
      tags: ["orders"],
      shareScope: "org_members",
    });

    const chartB = await chartService.saveChart({
      name: "Revenue by month",
      description: "Monthly revenue",
      definition: {
        datasetId: "market_performance",
        chartType: "bar",
        metrics: [{ type: "sum", field: "amount", alias: "revenue" }],
        dimensions: [{ type: "date_month", alias: "month" }],
      },
      tags: ["revenue"],
      shareScope: "org_members",
    });

    const updated = await chartService.updateChart(chartA.id, {
      name: "Orders by month v2",
      tags: ["orders", "revised"],
    });
    expect(updated.name).toContain("v2");

    const dashboard = await chartService.createDashboard({
      name: "Ops dashboard",
      description: "Operational KPIs",
      shareScope: "org_members",
    });

    await chartService.attachChartToDashboard(dashboard.id, { chartId: chartA.id });
    await chartService.attachChartToDashboard(dashboard.id, { chartId: chartB.id });

    const afterAttach = await chartService.listDashboards();
    const attachedDashboard = afterAttach.find((item) => item.id === dashboard.id);
    expect(attachedDashboard?.charts.length).toBe(2);

    await chartService.reorderDashboardCharts(dashboard.id, [chartB.id, chartA.id]);
    const afterReorder = (await chartService.listDashboards()).find((item) => item.id === dashboard.id);
    expect(afterReorder?.charts[0]?.chartId).toBe(chartB.id);

    const exportResult = await chartService.exportChart(chartA.id, { format: "csv" });
    expect(exportResult.format).toBe("csv");
    expect(exportResult.downloadUrl.startsWith("blob:")).toBe(true);

    const reportResult = await chartService.generateReport({
      dashboardId: dashboard.id,
      format: "json",
    });
    expect(reportResult.filename.endsWith(".json")).toBe(true);
    expect(reportResult.downloadUrl.startsWith("blob:")).toBe(true);
  }, 20_000);
});
