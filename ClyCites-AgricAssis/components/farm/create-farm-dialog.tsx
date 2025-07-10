"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useFarms } from "@/hooks/use-farms"
import type { Farm } from "@/lib/api/farm-api"

const farmSchema = z.object({
  name: z.string().min(1, "Farm name is required"),
  description: z.string().optional(),
  farmType: z.enum(["crop", "livestock", "mixed", "aquaculture", "poultry", "dairy"]),
  size: z.object({
    value: z.number().min(0.1, "Size must be greater than 0"),
    unit: z.enum(["hectares", "acres", "square_meters"]),
  }),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }),
  establishedDate: z.string().optional(),
  soilType: z.string().optional(),
  climateZone: z.string().optional(),
  irrigationSystem: z.string().optional(),
})

type FormData = z.infer<typeof farmSchema>

interface CreateFarmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  onFarmCreated: (farm: Farm) => void
}

export function CreateFarmDialog({ open, onOpenChange, organizationId, onFarmCreated }: CreateFarmDialogProps) {
  const [crops, setCrops] = useState<string[]>([])
  const [newCrop, setNewCrop] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createFarm } = useFarms({ organizationId, autoLoad: false })

  const form = useForm<FormData>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: "",
      description: "",
      farmType: "crop",
      size: {
        value: 1,
        unit: "hectares",
      },
      location: {
        address: "",
        city: "",
        state: "",
        country: "",
      },
      establishedDate: "",
      soilType: "",
      climateZone: "",
      irrigationSystem: "",
    },
  })

  const addCrop = () => {
    if (newCrop.trim() && !crops.includes(newCrop.trim())) {
      setCrops([...crops, newCrop.trim()])
      setNewCrop("")
    }
  }

  const removeCrop = (cropToRemove: string) => {
    setCrops(crops.filter((crop) => crop !== cropToRemove))
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      const farmData = {
        ...data,
        organizationId,
        crops: crops.length > 0 ? crops : undefined,
        establishedDate: data.establishedDate || undefined,
      }

      const newFarm = await createFarm(farmData)
      if (newFarm) {
        onFarmCreated(newFarm)
        form.reset()
        setCrops([])
        setNewCrop("")
      }
    } catch (error) {
      console.error("Error creating farm:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    setCrops([])
    setNewCrop("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Farm</DialogTitle>
          <DialogDescription>Add a new farm to your organization</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter farm name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your farm..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select farm type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="crop">Crop Production</SelectItem>
                        <SelectItem value="livestock">Livestock</SelectItem>
                        <SelectItem value="mixed">Mixed Farming</SelectItem>
                        <SelectItem value="aquaculture">Aquaculture</SelectItem>
                        <SelectItem value="poultry">Poultry</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Farm Size</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="size.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="0.0"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size.unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hectares">Hectares</SelectItem>
                          <SelectItem value="acres">Acres</SelectItem>
                          <SelectItem value="square_meters">Square Meters</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="location.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="State or Province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Crops */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Crops</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add crop"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCrop())}
                />
                <Button type="button" onClick={addCrop} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {crops.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {crops.map((crop) => (
                    <Badge key={crop} variant="secondary" className="gap-1">
                      {crop}
                      <button
                        type="button"
                        onClick={() => removeCrop(crop)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="establishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Established Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Clay, Sandy, Loam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="climateZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Climate Zone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tropical, Temperate, Arid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="irrigationSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Irrigation System</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Drip, Sprinkler, Flood" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Farm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
