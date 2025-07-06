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
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon, Clock } from "lucide-react"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const upcomingTasks = [
    {
      id: "1",
      title: "Maize Planting",
      date: "2024-01-15",
      time: "08:00 AM",
      type: "Planting",
      priority: "High",
    },
    {
      id: "2",
      title: "Irrigation System Check",
      date: "2024-01-16",
      time: "10:00 AM",
      type: "Maintenance",
      priority: "Medium",
    },
    {
      id: "3",
      title: "Fertilizer Application",
      date: "2024-01-18",
      time: "07:00 AM",
      type: "Treatment",
      priority: "High",
    },
    {
      id: "4",
      title: "Pest Inspection",
      date: "2024-01-20",
      time: "09:00 AM",
      type: "Inspection",
      priority: "Medium",
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
                <BreadcrumbPage>Calendar & Planning</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar & Planning</h1>
          <p className="text-muted-foreground">Schedule and manage your agricultural activities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
              <CardDescription>Select a date to view scheduled activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Your scheduled activities for the next few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{task.date}</span>
                        <span>•</span>
                        <span>{task.time}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                        <Badge variant={task.priority === "High" ? "destructive" : "default"} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
