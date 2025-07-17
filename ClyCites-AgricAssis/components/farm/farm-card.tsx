"use client"

import { useState } from "react"
import { MoreHorizontal, MapPin, Calendar, Users, Sprout, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditFarmDialog } from "./edit-farm-dialog"
import { DeleteFarmDialog } from "./delete-farm-dialog"
import type { Farm } from "@/lib/api/farm-api"

interface FarmCardProps {
  farm: Farm
  onFarmUpdated: (farm: Farm) => void
  onFarmDeleted: (farmId: string) => void
  onViewDetails: (farm: Farm) => void
}

export function FarmCard({ farm, onFarmUpdated, onFarmDeleted, onViewDetails }: FarmCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getFarmTypeColor = (type: string) => {
    const colors = {
      crop: "bg-green-100 text-green-800 border-green-200",
      livestock: "bg-blue-100 text-blue-800 border-blue-200",
      mixed: "bg-purple-100 text-purple-800 border-purple-200",
      aquaculture: "bg-cyan-100 text-cyan-800 border-cyan-200",
      poultry: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dairy: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatFarmType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1")
  }

  const handleEditSuccess = (updatedFarm: Farm) => {
    onFarmUpdated(updatedFarm)
    setShowEditDialog(false)
  }

  const handleDeleteSuccess = () => {
    onFarmDeleted(farm._id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg">{farm.name}</CardTitle>
              {farm.description && <CardDescription className="line-clamp-2">{farm.description}</CardDescription>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(farm)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Farm
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Farm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Farm Type and Status */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getFarmTypeColor(farm.farmType)}>
              {formatFarmType(farm.farmType)}
            </Badge>
            <Badge variant={farm.isActive ? "default" : "secondary"}>{farm.isActive ? "Active" : "Inactive"}</Badge>
          </div>

          {/* Farm Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sprout className="h-4 w-4" />
              <span>
                {farm.size.value} {farm.size.unit}
              </span>
            </div>

            {farm.location.address && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{farm.location.address}</span>
              </div>
            )}

            {farm.establishedDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Established {new Date(farm.establishedDate).getFullYear()}</span>
              </div>
            )}

            {farm.crops && farm.crops.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sprout className="h-4 w-4" />
                <span className="truncate">Crops: {farm.crops.slice(0, 3).join(", ")}</span>
                {farm.crops.length > 3 && <span>+{farm.crops.length - 3} more</span>}
              </div>
            )}

            {farm.livestock && farm.livestock.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Livestock: {farm.livestock.reduce((total, animal) => total + animal.count, 0)} animals</span>
              </div>
            )}
          </div>

          {/* Certifications */}
          {farm.certifications && farm.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {farm.certifications.slice(0, 2).map((cert) => (
                <Badge key={cert} variant="secondary" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {farm.certifications.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{farm.certifications.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <EditFarmDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        farm={farm}
        onSuccess={handleEditSuccess}
      />

      <DeleteFarmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        farm={farm}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
