import type { Page } from "@playwright/test";

interface MockOptions {
  role: string;
  organizationId?: string;
}

export async function mockAuthAndDashboard(page: Page, options: MockOptions) {
  const organizationId = options.organizationId ?? "64f1b2c3d4e5f6a7b8c9d0e1";

  await page.route("**/api/v1/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          accessToken: "jwt-token",
          expiresIn: "15m",
          user: {
            id: "64f1b2c3d4e5f6a7b8c9d0aa",
            firstName: "Test",
            lastName: "User",
            email: "test@clycites.com",
            role: options.role,
            createdAt: new Date().toISOString(),
          },
        },
        meta: { requestId: "req_login" },
      }),
    });
  });

  await page.route("**/api/v1/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          id: "64f1b2c3d4e5f6a7b8c9d0aa",
          firstName: "Test",
          lastName: "User",
          email: "test@clycites.com",
          role: options.role,
          createdAt: new Date().toISOString(),
        },
      }),
    });
  });

  await page.route("**/api/v1/organizations/me**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: organizationId,
            name: "ClyCites Org",
            type: "company",
            role: options.role,
          },
        ],
      }),
    });
  });

  await page.route("**/api/v1/analytics**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          activeOrders: 12,
          settlementVolume: "$42,000",
        },
      }),
    });
  });

  await page.route("**/api/v1/weather**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [
          { id: "w1", alertType: "flood", message: "Heavy rainfall watch" },
        ],
      }),
    });
  });

  await page.route("**/api/v1/notifications**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: "n1",
            type: "orders",
            title: "Order #A1 moved to processing",
            status: "active",
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    });
  });
}
