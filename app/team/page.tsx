"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Users, Plus, UserPlus, CheckCircle, Clock, MessageSquare, Phone, Volume2, Trash2, User } from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type FarmMember = {
  id: string
  name: string
  phoneNumber: string
  role: "owner" | "worker" | "family"
  joinedDate: Date
  isActive: boolean
}

type SharedTask = {
  id: string
  title: string
  description: string
  assignedTo: string // member id
  assignedBy: string // member id
  cropType: string
  taskType: "planting" | "watering" | "fertilizing" | "weeding" | "harvesting" | "spraying" | "general"
  dueDate: Date
  status: "pending" | "in-progress" | "completed"
  completedBy?: string
  completedAt?: Date
  notes?: string
  voiceAssigned: boolean
}

type ActivityLog = {
  id: string
  taskId: string
  memberId: string
  memberName: string
  action: "assigned" | "started" | "completed" | "updated"
  timestamp: Date
  details?: string
}

const CROP_TYPES = [
  "Maize (Mahindi)",
  "Beans (Maharagwe)",
  "Tomatoes (Nyanya)",
  "Kale (Sukuma Wiki)",
  "Cabbage (Kabichi)",
  "Potatoes (Viazi)",
  "Carrots (Karoti)",
  "Onions (Vitunguu)",
  "General Farm Work",
]

const TASK_TYPES = [
  { value: "planting", label: "Planting", icon: "🌱" },
  { value: "watering", label: "Watering", icon: "💧" },
  { value: "fertilizing", label: "Fertilizing", icon: "🌿" },
  { value: "weeding", label: "Weeding", icon: "🌾" },
  { value: "harvesting", label: "Harvesting", icon: "🌽" },
  { value: "spraying", label: "Spraying", icon: "💨" },
  { value: "general", label: "General Task", icon: "📋" },
]

export default function TeamCollaborationPage() {
  const [members, setMembers] = useState<FarmMember[]>([])
  const [tasks, setTasks] = useState<SharedTask[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [currentUserId] = useState("user-1") // In real app, get from auth session
  const [currentUserName] = useState("Farm Owner") // In real app, get from auth session

  const [newMember, setNewMember] = useState({
    name: "",
    phoneNumber: "",
    role: "worker" as "owner" | "worker" | "family",
  })

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    cropType: "",
    taskType: "",
    dueDate: new Date(),
  })

  useEffect(() => {
    loadMembers()
    loadTasks()
    loadActivityLogs()
  }, [])

  const loadMembers = () => {
    const saved = localStorage.getItem("farmTeamMembers")
    if (saved) {
      const parsed = JSON.parse(saved)
      setMembers(parsed.map((m: any) => ({ ...m, joinedDate: new Date(m.joinedDate) })))
    } else {
      // Demo members
      const demoMembers: FarmMember[] = [
        {
          id: "user-1",
          name: "Farm Owner",
          phoneNumber: "+254712345678",
          role: "owner",
          joinedDate: new Date(),
          isActive: true,
        },
        {
          id: "member-1",
          name: "John Kamau",
          phoneNumber: "+254723456789",
          role: "worker",
          joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        {
          id: "member-2",
          name: "Mary Wanjiku",
          phoneNumber: "+254734567890",
          role: "family",
          joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
      ]
      setMembers(demoMembers)
      localStorage.setItem("farmTeamMembers", JSON.stringify(demoMembers))
    }
  }

  const loadTasks = () => {
    const saved = localStorage.getItem("farmTeamTasks")
    if (saved) {
      const parsed = JSON.parse(saved)
      setTasks(
        parsed.map((t: any) => ({
          ...t,
          dueDate: new Date(t.dueDate),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        }))
      )
    } else {
      // Demo tasks
      const demoTasks: SharedTask[] = [
        {
          id: "task-1",
          title: "Plant Maize in North Field",
          description: "Plant 5 acres of maize following the lines we marked yesterday",
          assignedTo: "member-1",
          assignedBy: "user-1",
          cropType: "Maize (Mahindi)",
          taskType: "planting",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: "pending",
          voiceAssigned: true,
        },
        {
          id: "task-2",
          title: "Water Tomato Greenhouse",
          description: "Morning watering for all tomato plants",
          assignedTo: "member-2",
          assignedBy: "user-1",
          cropType: "Tomatoes (Nyanya)",
          taskType: "watering",
          dueDate: new Date(),
          status: "in-progress",
          voiceAssigned: false,
        },
      ]
      setTasks(demoTasks)
      localStorage.setItem("farmTeamTasks", JSON.stringify(demoTasks))
    }
  }

  const loadActivityLogs = () => {
    const saved = localStorage.getItem("farmActivityLogs")
    if (saved) {
      const parsed = JSON.parse(saved)
      setActivityLogs(parsed.map((log: any) => ({ ...log, timestamp: new Date(log.timestamp) })))
    } else {
      // Demo logs
      const demoLogs: ActivityLog[] = [
        {
          id: "log-1",
          taskId: "task-1",
          memberId: "user-1",
          memberName: "Farm Owner",
          action: "assigned",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          details: "Assigned to John Kamau via voice command",
        },
        {
          id: "log-2",
          taskId: "task-2",
          memberId: "member-2",
          memberName: "Mary Wanjiku",
          action: "started",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
      ]
      setActivityLogs(demoLogs)
      localStorage.setItem("farmActivityLogs", JSON.stringify(demoLogs))
    }
  }

  const addMember = () => {
    if (!newMember.name || !newMember.phoneNumber) {
      toast.error("Please fill in all fields")
      return
    }

    const member: FarmMember = {
      id: `member-${Date.now()}`,
      name: newMember.name,
      phoneNumber: newMember.phoneNumber,
      role: newMember.role,
      joinedDate: new Date(),
      isActive: true,
    }

    const updated = [...members, member]
    setMembers(updated)
    localStorage.setItem("farmTeamMembers", JSON.stringify(updated))

    toast.success(`${member.name} added to your farm team!`)
    setIsAddMemberOpen(false)
    setNewMember({ name: "", phoneNumber: "", role: "worker" })
  }

  const addTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.taskType) {
      toast.error("Please fill in all required fields")
      return
    }

    const task: SharedTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedBy: currentUserId,
      cropType: newTask.cropType || "General Farm Work",
      taskType: newTask.taskType as any,
      dueDate: newTask.dueDate,
      status: "pending",
      voiceAssigned: false,
    }

    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    localStorage.setItem("farmTeamTasks", JSON.stringify(updatedTasks))

    // Log the assignment
    const assignedMember = members.find((m) => m.id === task.assignedTo)
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: task.id,
      memberId: currentUserId,
      memberName: currentUserName,
      action: "assigned",
      timestamp: new Date(),
      details: `Assigned to ${assignedMember?.name}`,
    }

    const updatedLogs = [...activityLogs, log]
    setActivityLogs(updatedLogs)
    localStorage.setItem("farmActivityLogs", JSON.stringify(updatedLogs))

    toast.success(`Task assigned to ${assignedMember?.name}!`, {
      description: "They will be notified via SMS",
    })

    setIsAddTaskOpen(false)
    resetTaskForm()
  }

  const updateTaskStatus = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: newStatus,
            completedBy: newStatus === "completed" ? currentUserId : t.completedBy,
            completedAt: newStatus === "completed" ? new Date() : t.completedAt,
          }
        : t
    )

    setTasks(updated)
    localStorage.setItem("farmTeamTasks", JSON.stringify(updated))

    // Log the action
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: taskId,
      memberId: currentUserId,
      memberName: currentUserName,
      action: newStatus === "completed" ? "completed" : newStatus === "in-progress" ? "started" : "updated",
      timestamp: new Date(),
    }

    const updatedLogs = [...activityLogs, log]
    setActivityLogs(updatedLogs)
    localStorage.setItem("farmActivityLogs", JSON.stringify(updatedLogs))

    toast.success(`Task ${newStatus === "completed" ? "completed" : "updated"}!`)
  }

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId)
    setTasks(updated)
    localStorage.setItem("farmTeamTasks", JSON.stringify(updated))
    toast.success("Task deleted")
  }

  const removeMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    if (member?.role === "owner") {
      toast.error("Cannot remove farm owner")
      return
    }

    const updated = members.filter((m) => m.id !== memberId)
    setMembers(updated)
    localStorage.setItem("farmTeamMembers", JSON.stringify(updated))
    toast.success(`${member?.name} removed from team`)
  }

  const resetTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      cropType: "",
      taskType: "",
      dueDate: new Date(),
    })
  }

  const getMemberName = (memberId: string) => {
    return members.find((m) => m.id === memberId)?.name || "Unknown"
  }

  const getTasksByStatus = (status: "pending" | "in-progress" | "completed") => {
    return tasks.filter((t) => t.status === status).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  const getRecentLogs = () => {
    return activityLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)
  }

  const getTaskIcon = (taskType: string) => {
    return TASK_TYPES.find((t) => t.value === taskType)?.icon || "📋"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-green-600" />
              Farm Team Collaboration
            </h1>
            <p className="text-gray-600 mt-1">Manage your team and assign tasks via voice</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-green-700">{members.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-yellow-700">{getTasksByStatus("pending").length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-700">{getTasksByStatus("in-progress").length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-800">{getTasksByStatus("completed").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {/* Voice Assignment Info Banner */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Volume2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">💡 Try Voice Task Assignment!</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Go to AgriVoice and say things like:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>"Assign John to water the tomatoes tomorrow"</li>
                      <li>"Tell Mary to plant maize on Friday"</li>
                      <li>"Have Peter fertilize the cabbage field"</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">
                      Tasks will appear here automatically and team members will be notified via SMS!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Shared Tasks</h2>
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Assign New Task</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Task Title</Label>
                      <Input
                        placeholder="e.g., Water the tomato field"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Add task details..."
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Assign To</Label>
                      <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.filter((m) => m.isActive && m.id !== currentUserId).map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Crop Type</Label>
                        <Select value={newTask.cropType} onValueChange={(value) => setNewTask({ ...newTask, cropType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent>
                            {CROP_TYPES.map((crop) => (
                              <SelectItem key={crop} value={crop}>
                                {crop}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Task Type</Label>
                        <Select value={newTask.taskType} onValueChange={(value) => setNewTask({ ...newTask, taskType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {TASK_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newTask.dueDate.toISOString().split("T")[0]}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addTask} className="bg-green-600 hover:bg-green-700">
                      Assign Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Pending Tasks */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({getTasksByStatus("pending").length})
              </h3>
              {getTasksByStatus("pending").length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="p-6 text-center text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No pending tasks</p>
                  </CardContent>
                </Card>
              ) : (
                getTasksByStatus("pending").map((task) => (
                  <Card key={task.id} className="border-2 border-yellow-200 hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{getTaskIcon(task.taskType)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900">{task.title}</h4>
                            {task.voiceAssigned && (
                              <Badge variant="secondary" className="text-xs">
                                <Volume2 className="h-3 w-3 mr-1" />
                                Voice
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                            <span>📦 {task.cropType}</span>
                            <span>👤 Assigned to: {getMemberName(task.assignedTo)}</span>
                            <span>📅 Due: {task.dueDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTaskStatus(task.id, "in-progress")}
                            >
                              Start Task
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* In Progress Tasks */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                In Progress ({getTasksByStatus("in-progress").length})
              </h3>
              {getTasksByStatus("in-progress").map((task) => (
                <Card key={task.id} className="border-2 border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{getTaskIcon(task.taskType)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{task.title}</h4>
                          <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                          <span>📦 {task.cropType}</span>
                          <span>👤 {getMemberName(task.assignedTo)}</span>
                          <span>📅 Due: {task.dueDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateTaskStatus(task.id, "completed")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Completed Tasks */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Completed ({getTasksByStatus("completed").length})
              </h3>
              {getTasksByStatus("completed").map((task) => (
                <Card key={task.id} className="border-2 border-green-200 bg-green-50/50 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl opacity-50">{getTaskIcon(task.taskType)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-700 line-through">{task.title}</h4>
                          <Badge className="bg-green-600">Completed</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>✓ By: {getMemberName(task.completedBy || task.assignedTo)}</span>
                          <span>📅 {task.completedAt?.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Team Members</h2>
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Full name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="+254712345678"
                        value={newMember.phoneNumber}
                        onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value: any) => setNewMember({ ...newMember, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="worker">Worker</SelectItem>
                          <SelectItem value="family">Family Member</SelectItem>
                          <SelectItem value="owner">Co-Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addMember} className="bg-green-600 hover:bg-green-700">
                      Add Member
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <Card key={member.id} className="border-2 border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{member.name}</h4>
                          <Badge
                            variant={member.role === "owner" ? "default" : "secondary"}
                            className={member.role === "owner" ? "bg-green-600" : ""}
                          >
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <Phone className="h-3 w-3 inline mr-1" />
                          {member.phoneNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {member.joinedDate.toLocaleDateString()}
                        </p>
                      </div>
                      {member.role !== "owner" && (
                        <Button size="sm" variant="ghost" onClick={() => removeMember(member.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    {/* Member's tasks summary */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-4 text-xs">
                        <span className="text-yellow-600">
                          ⏳ {tasks.filter((t) => t.assignedTo === member.id && t.status === "pending").length} pending
                        </span>
                        <span className="text-blue-600">
                          🔄 {tasks.filter((t) => t.assignedTo === member.id && t.status === "in-progress").length} in progress
                        </span>
                        <span className="text-green-600">
                          ✓ {tasks.filter((t) => t.assignedTo === member.id && t.status === "completed").length} completed
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>

            {getRecentLogs().length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="p-6 text-center text-gray-500">
                  <p>No activity yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {getRecentLogs().map((log) => {
                  const task = tasks.find((t) => t.id === log.taskId)
                  return (
                    <Card key={log.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            {log.action === "assigned" && <Plus className="h-4 w-4 text-green-600" />}
                            {log.action === "started" && <Clock className="h-4 w-4 text-blue-600" />}
                            {log.action === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {log.action === "updated" && <MessageSquare className="h-4 w-4 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-semibold">{log.memberName}</span>{" "}
                              <span className="text-gray-600">
                                {log.action === "assigned" && "assigned"}
                                {log.action === "started" && "started"}
                                {log.action === "completed" && "completed"}
                                {log.action === "updated" && "updated"}
                              </span>{" "}
                              <span className="font-medium">{task?.title}</span>
                            </p>
                            {log.details && <p className="text-xs text-gray-500 mt-1">{log.details}</p>}
                            <p className="text-xs text-gray-400 mt-1">
                              {log.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  )
}
