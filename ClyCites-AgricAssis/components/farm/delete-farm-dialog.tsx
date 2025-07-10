"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useFarms } from "@/hooks/use-farms"
import type { Farm } from "@/lib/api/farm-api"

interface DeleteFarmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  farm: Farm
  onSuccess: () => void
}

export function DeleteFarmDialog({ open, onOpenChange, farm, onSuccess }: DeleteFarmDialogProps) {
  const [confirmationText, setConfirmationText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const { deleteFarm } = useFarms({ organizationId: farm.organizationId, autoLoad: false })

  const isConfirmationValid = confirmationText === farm.name

  const handleDelete = async () => {
    if (!isConfirmationValid) return

    try {
      setIsDeleting(true)
      const success = await deleteFarm(farm._id)
      if (success) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error deleting farm:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    setConfirmationText("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Farm
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the farm and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Deleting this farm will remove all associated data including crops, livestock
              records, equipment, and historical data. This action is irreversible.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <strong>{farm.name}</strong> to confirm deletion:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={farm.name}
              className="font-mono"
            />
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="font-medium mb-1">Farm to be deleted:</div>
            <div className="text-muted-foreground">
              <div>Name: {farm.name}</div>
              <div>Type: {farm.farmType}</div>
              <div>
                Size: {farm.size.value} {farm.size.unit}
              </div>
              {farm.location.address && <div>Location: {farm.location.address}</div>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={!isConfirmationValid || isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Farm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
