"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react"
import { dailyAssistantApi, type DailyTask } from "@/lib/api/daily-assistant-api"

interface TaskListProps {
  tasks: DailyTask[]
  onTaskUpdate: () => void
  farmId: string
}

export function TaskList({ tasks, onTaskUpdate, farmId }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const updateTaskStatus = async (taskId: string, status: DailyTask["status"], completionData?: any) => {
    try {
      setUpdating(taskId)
      await dailyAssistantApi.updateTaskStatus(taskId, status, completionData)
      onTaskUpdate()
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setUpdating(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const category = task.category
      if (!acc[category]) acc[category] = []
      acc[category].push(task)
      return acc
    },
    {} as Record<string, DailyTask[]>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category.replace("_", " ")}</CardTitle>
            <CardDescription>
              {categoryTasks.length} task{categoryTasks.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryTasks.map((task) => (
                <div key={task._id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateTaskStatus(task._id, "completed", {
                          completedAt: new Date().toISOString(),
                          notes: "Completed via dashboard",
                        })
                      } else {
                        updateTaskStatus(task._id, "pending")
                      }
                    }}
                    disabled={updating === task._id}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(task.status)}
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      {task.aiGenerated && (
                        <Badge variant="outline" className="text-xs">
                          AI Generated
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {task.estimatedDuration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedDuration.value} {task.estimatedDuration.unit}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.taskDate).toLocaleDateString()}
                      </div>

                      {task.isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          {task.daysOverdue} days overdue
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{task.title}</DialogTitle>
                          <DialogDescription>Task details and instructions</DialogDescription>
                        </DialogHeader>

                        {selectedTask && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                            </div>

                            {selectedTask.instructions && selectedTask.instructions.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Instructions</h4>
                                <div className="space-y-2">
                                  {selectedTask.instructions.map((instruction, index) => (
                                    <div key={index} className="flex gap-3 p-2 border rounded">
                                      <Badge variant="outline">{instruction.step}</Badge>
                                      <div className="flex-1">
                                        <p className="text-sm">{instruction.description}</p>
                                        {instruction.duration && (
                                          <p className="text-xs text-muted-foreground">
                                            ~{instruction.duration} minutes
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedTask.resources && selectedTask.resources.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Required Resources</h4>
                                <div className="flex flex-wrap gap-1">
                                  {selectedTask.resources.map((resource, index) => (
                                    <Badge key={index} variant="secondary">
                                      {resource}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2 pt-4">
                              <Select
                                value={selectedTask.status}
                                onValueChange={(status) =>
                                  updateTaskStatus(selectedTask._id, status as DailyTask["status"])
                                }
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="skipped">Skipped</SelectItem>
                                  <SelectItem value="postponed">Postponed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {task.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(task._id, "in_progress")}
                        disabled={updating === task._id}
                      >
                        Start
                      </Button>
                    )}

                    {task.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateTaskStatus(task._id, "completed", {
                            completedAt: new Date().toISOString(),
                            notes: "Completed via dashboard",
                          })
                        }
                        disabled={updating === task._id}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
