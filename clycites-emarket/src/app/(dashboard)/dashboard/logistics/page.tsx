"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, UploadCloud } from "lucide-react";
import { logisticsApi, type CollectionPoint, type Shipment, type ShipmentTrackingEvent } from "@/lib/api/endpoints/platform.api";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DataTable, type Column } from "@/components/market/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const shipmentStatuses: ShipmentTrackingEvent["status"][] = [
  "created",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
  "returned",
];

const podAllowedMime = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const podMaxSizeBytes = 5 * 1024 * 1024;

export default function LogisticsPage() {
  const qc = useQueryClient();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newPoint, setNewPoint] = useState<Partial<CollectionPoint>>({
    name: "",
    type: "collection_point",
    address: { country: "", district: "" },
  });
  const [newShipment, setNewShipment] = useState({
    orderId: "",
    from: "",
    to: "",
  });
  const [trackingNote, setTrackingNote] = useState("");
  const [trackingLocation, setTrackingLocation] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<ShipmentTrackingEvent["status"]>("in_transit");
  const [podFile, setPodFile] = useState<File | null>(null);

  const pointsQuery = useQuery({
    queryKey: ["logistics", "collection-points"],
    queryFn: () => logisticsApi.listCollectionPoints(),
  });

  const shipmentsQuery = useQuery({
    queryKey: ["logistics", "shipments"],
    queryFn: () => logisticsApi.listShipments(),
  });

  const createPointMutation = useMutation({
    mutationFn: () => logisticsApi.createCollectionPoint(newPoint),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logistics", "collection-points"] });
      setNewPoint({ name: "", type: "collection_point", address: { country: "", district: "" } });
      toast({ title: "Collection point created", variant: "success" });
    },
  });

  const updatePointMutation = useMutation({
    mutationFn: (args: { id: string; payload: Partial<CollectionPoint> }) =>
      logisticsApi.updateCollectionPoint(args.id, args.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logistics", "collection-points"] });
      toast({ title: "Collection point updated", variant: "success" });
    },
  });

  const deletePointMutation = useMutation({
    mutationFn: (id: string) => logisticsApi.deactivateCollectionPoint(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logistics", "collection-points"] });
      toast({ title: "Collection point deactivated", variant: "success" });
    },
  });

  const createShipmentMutation = useMutation({
    mutationFn: () =>
      logisticsApi.createShipment({
        orderId: newShipment.orderId || undefined,
        from: { address: newShipment.from },
        to: { address: newShipment.to },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logistics", "shipments"] });
      setNewShipment({ orderId: "", from: "", to: "" });
      toast({ title: "Shipment created", variant: "success" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (payload: ShipmentTrackingEvent) =>
      logisticsApi.updateShipmentStatus(selectedShipment!.id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logistics", "shipments"] });
      toast({ title: "Shipment status updated", variant: "success" });
    },
  });

  const addTrackingMutation = useMutation({
    mutationFn: () =>
      logisticsApi.addTrackingEvent(selectedShipment!.id, {
        status: trackingStatus,
        note: trackingNote || undefined,
        location: trackingLocation || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logistics", "shipments"] });
      setTrackingNote("");
      setTrackingLocation("");
      toast({ title: "Tracking event added", variant: "success" });
    },
  });

  const uploadPodMutation = useMutation({
    mutationFn: () => {
      if (!podFile || !selectedShipment) {
        throw new Error("Select shipment and proof file first");
      }

      if (!podAllowedMime.includes(podFile.type)) {
        throw new Error("Invalid proof format. Allowed: jpeg/png/webp/pdf");
      }

      if (podFile.size > podMaxSizeBytes) {
        throw new Error("Proof file exceeds 5MB");
      }

      const form = new FormData();
      form.append("proof", podFile);
      return logisticsApi.uploadProofOfDelivery(selectedShipment.id, form);
    },
    onSuccess: () => {
      setPodFile(null);
      toast({ title: "Proof of delivery uploaded", variant: "success" });
    },
  });

  const collectionPoints = useMemo(() => {
    const source = pointsQuery.data as CollectionPoint[] | { data?: CollectionPoint[] } | undefined;
    return Array.isArray(source) ? source : source?.data ?? [];
  }, [pointsQuery.data]);

  const shipments = useMemo(() => {
    const source = shipmentsQuery.data as Shipment[] | { data?: Shipment[] } | undefined;
    return Array.isArray(source) ? source : source?.data ?? [];
  }, [shipmentsQuery.data]);

  const shipmentsByStatus = useMemo(() => {
    return shipmentStatuses.reduce<Record<string, Shipment[]>>((acc, status) => {
      acc[status] = shipments.filter((shipment) => shipment.status === status);
      return acc;
    }, {});
  }, [shipments]);

  const pointColumns: Column<CollectionPoint>[] = [
    { key: "name", header: "Name" },
    { key: "type", header: "Type", render: (row) => <span className="capitalize">{row.type.replace("_", " ")}</span> },
    { key: "address", header: "Address", render: (row) => <span>{row.address?.district}, {row.address?.country}</span> },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={row.status === "inactive" ? "destructive" : "success"}>{row.status ?? "active"}</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              updatePointMutation.mutate({
                id: row.id,
                payload: { status: row.status === "inactive" ? "active" : "inactive" },
              });
            }}
          >
            Toggle
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              deletePointMutation.mutate(row.id);
            }}
          >
            Deactivate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {(pointsQuery.error || shipmentsQuery.error || createPointMutation.error || uploadPodMutation.error) && (
        <div className="grid gap-3">
          {pointsQuery.error && <ApiErrorPanel error={pointsQuery.error} />}
          {shipmentsQuery.error && <ApiErrorPanel error={shipmentsQuery.error} compact />}
          {createPointMutation.error && <ApiErrorPanel error={createPointMutation.error} compact />}
          {uploadPodMutation.error && <ApiErrorPanel error={uploadPodMutation.error} compact />}
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Collection Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={newPoint.name ?? ""}
                  onChange={(e) => setNewPoint((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={newPoint.type}
                  onValueChange={(value) => setNewPoint((prev) => ({ ...prev, type: value as CollectionPoint["type"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collection_point">Collection Point</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>District</Label>
                <Input
                  value={newPoint.address?.district ?? ""}
                  onChange={(e) =>
                    setNewPoint((prev) => ({
                      ...prev,
                      address: { ...prev.address, district: e.target.value, country: prev.address?.country ?? "" },
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input
                  value={newPoint.address?.country ?? ""}
                  onChange={(e) =>
                    setNewPoint((prev) => ({
                      ...prev,
                      address: { ...prev.address, country: e.target.value, district: prev.address?.district ?? "" },
                    }))
                  }
                />
              </div>
            </div>
            <Button
              onClick={() => createPointMutation.mutate()}
              loading={createPointMutation.isPending}
              disabled={!newPoint.name || !newPoint.address?.country || !newPoint.address?.district}
            >
              <Plus className="h-4 w-4" />
              Add Collection Point
            </Button>

            <DataTable
              data={collectionPoints}
              columns={pointColumns}
              isLoading={pointsQuery.isLoading}
              emptyTitle="No collection points"
              emptyDescription="Create your first collection point."
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Create Shipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Order ID</Label>
              <Input value={newShipment.orderId} onChange={(e) => setNewShipment((prev) => ({ ...prev, orderId: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>From</Label>
              <Input value={newShipment.from} onChange={(e) => setNewShipment((prev) => ({ ...prev, from: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>To</Label>
              <Input value={newShipment.to} onChange={(e) => setNewShipment((prev) => ({ ...prev, to: e.target.value }))} />
            </div>
            <Button
              onClick={() => createShipmentMutation.mutate()}
              loading={createShipmentMutation.isPending}
              disabled={!newShipment.from || !newShipment.to}
            >
              Create Shipment
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">Shipment Lifecycle Board</h3>
          <Badge variant="outline">Click a shipment for timeline details</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {shipmentStatuses.map((status) => (
            <Card key={status} className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm capitalize">{status.replace("_", " ")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {shipmentsByStatus[status]?.length === 0 && (
                  <p className="text-xs text-muted-foreground">No shipments</p>
                )}
                {shipmentsByStatus[status]?.map((shipment) => (
                  <button
                    key={shipment.id}
                    className="w-full rounded-xl border border-border/70 p-2 text-left text-xs hover:bg-muted/60"
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <p className="font-mono">{shipment.id.slice(-8)}</p>
                    <p className="text-muted-foreground">{String(shipment.orderId ?? "No order")}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Sheet open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedShipment(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Shipment {selectedShipment?.id}</SheetTitle>
            <SheetDescription>Tracking timeline and proof-of-delivery controls</SheetDescription>
          </SheetHeader>

          {selectedShipment && (
            <div className="mt-5 space-y-5">
              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <Label>Status Transition</Label>
                <Select
                  value={trackingStatus}
                  onValueChange={(value) => setTrackingStatus(value as ShipmentTrackingEvent["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shipmentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate({ status: trackingStatus })}
                  loading={updateStatusMutation.isPending}
                >
                  Update Status
                </Button>
              </div>

              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <Label>Tracking Note</Label>
                <Input value={trackingNote} onChange={(e) => setTrackingNote(e.target.value)} />
                <Label>Location</Label>
                <Input value={trackingLocation} onChange={(e) => setTrackingLocation(e.target.value)} />
                <Button className="w-full" onClick={() => addTrackingMutation.mutate()} loading={addTrackingMutation.isPending}>
                  Add Tracking Event
                </Button>
              </div>

              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <Label>Proof of Delivery</Label>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={(e) => setPodFile(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">
                  Allowed formats: jpeg/png/webp/pdf. Maximum size: 5MB.
                </p>
                <Button
                  className="w-full"
                  onClick={() => uploadPodMutation.mutate()}
                  loading={uploadPodMutation.isPending}
                  disabled={!podFile}
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload POD
                </Button>
              </div>

              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <p className="text-sm font-medium">Tracking Timeline</p>
                {(selectedShipment.trackingEvents ?? []).length === 0 && (
                  <p className="text-xs text-muted-foreground">No tracking events yet.</p>
                )}
                {(selectedShipment.trackingEvents ?? []).map((event, index) => (
                  <div key={String(event.id ?? index)} className="rounded-lg border border-border/60 p-2 text-xs">
                    <p className="font-medium capitalize">{event.status.replace("_", " ")}</p>
                    <p className="text-muted-foreground">{event.note ?? "No note"}</p>
                    <p className="text-muted-foreground">{event.location ?? "No location"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
