"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Calendar, Users } from "lucide-react"

export default function FarmsPage() {
  const farms = [
    {
      id: "1",
      name: "Green Valley Farm",
      type: "Mixed Farming",
      size: "50 hectares",
      location: "Nairobi, Kenya",
      crops: ["Maize", "Beans", "Tomatoes"],
      lastActivity: "2 hours ago",
      status: "Active",
    },
    {
      id: "2",
      name: "Sunrise Agriculture",
      type: "Crop Production",
      size: "75 hectares",
      location: "Lagos, Nigeria",
      crops: ["Rice", "Cassava", "Yam"],
      lastActivity: "1 day ago",
      status: "Active",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>My Farms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Farm
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Farms</h1>
          <p className="text-muted-foreground">Manage and monitor all your agricultural operations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <Card key={farm.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{farm.name}</CardTitle>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{farm.status}</span>
                </div>
                <CardDescription>{farm.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {farm.location}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {farm.size}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Last activity: {farm.lastActivity}
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Active Crops:</p>
                  <div className="flex flex-wrap gap-1">
                    {farm.crops.map((crop) => (
                      <span key={crop} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
