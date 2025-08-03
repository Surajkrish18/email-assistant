"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Users, Settings } from "lucide-react"
import { Header } from "@/components/header" // Import the new Header component

interface Client {
  id: string
  name: string
  technicalKnowledge: number
  description: string
}

export default function AdminPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    technicalKnowledge: 1,
    description: "",
  })

  // Load clients from localStorage on component mount
  useEffect(() => {
    const savedClients = localStorage.getItem("emailReviewClients")
    if (savedClients) {
      setClients(JSON.parse(savedClients))
    }
  }, [])

  // Save clients to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem("emailReviewClients", JSON.stringify(clients))
  }, [clients])

  const handleAddClient = () => {
    if (!formData.name.trim()) return

    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      technicalKnowledge: formData.technicalKnowledge,
      description: formData.description,
    }

    setClients([...clients, newClient])
    setFormData({ name: "", technicalKnowledge: 1, description: "" })
  }

  const handleEditClient = (client: Client) => {
    setIsEditing(client.id)
    setFormData({
      name: client.name,
      technicalKnowledge: client.technicalKnowledge,
      description: client.description,
    })
  }

  const handleUpdateClient = () => {
    if (!formData.name.trim() || !isEditing) return

    setClients(
      clients.map((client) =>
        client.id === isEditing
          ? {
              ...client,
              name: formData.name,
              technicalKnowledge: formData.technicalKnowledge,
              description: formData.description,
            }
          : client,
      ),
    )

    setIsEditing(null)
    setFormData({ name: "", technicalKnowledge: 1, description: "" })
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id))
  }

  const handleCancelEdit = () => {
    setIsEditing(null)
    setFormData({ name: "", technicalKnowledge: 1, description: "" })
  }

  const getTechnicalLevelText = (level: number) => {
    if (level <= 2) return "Beginner"
    if (level <= 4) return "Intermediate"
    return "Advanced"
  }

  const getTechnicalLevelColor = (level: number) => {
    if (level <= 2) return "bg-red-100 text-red-800 border-red-200"
    if (level <= 4) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors">
      <Header isAdminPage={true} /> {/* Use the new Header component and pass isAdminPage prop */}
      <div className="max-w-6xl mx-auto pt-20">
        {" "}
        {/* Added pt-20 for spacing below fixed header */}
        {/* Header */}
        <div className="flex items-center gap-3 mb-12">
          <Settings className="h-8 w-8 text-indigo-600" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-colors duration-300">
            Client Management
          </h1>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Add/Edit Client Form */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Plus className="h-6 w-6" />
                {isEditing ? "Edit Client" : "Add New Client"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter client name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="technicalKnowledge"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Technical Knowledge Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.technicalKnowledge.toString()}
                  onValueChange={(value) => setFormData({ ...formData, technicalKnowledge: Number.parseInt(value) })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Beginner (No technical background)</SelectItem>
                    <SelectItem value="2">2 - Beginner (Basic computer skills)</SelectItem>
                    <SelectItem value="3">3 - Intermediate (Some technical understanding)</SelectItem>
                    <SelectItem value="4">4 - Intermediate (Good technical grasp)</SelectItem>
                    <SelectItem value="5">5 - Advanced (High technical expertise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Description <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes about the client's background or preferences"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="resize-none border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                />
              </div>

              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleUpdateClient}
                      disabled={!formData.name.trim()}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      Update Client
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAddClient}
                    disabled={!formData.name.trim()}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    Add Client
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client List */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="h-6 w-6" />
                Existing Clients ({clients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {clients.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                  <p className="text-gray-400">
                    Add your first client to get started with personalized email redrafting
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow transition-colors duration-300"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            {client.name}
                          </h3>
                          <Badge className={`${getTechnicalLevelColor(client.technicalKnowledge)} border`}>
                            Level {client.technicalKnowledge} - {getTechnicalLevelText(client.technicalKnowledge)}
                          </Badge>
                        </div>
                        {client.description && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">{client.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClient(client)}
                          className="hover:bg-indigo-50 hover:border-indigo-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Technical Knowledge Guide */}
        <Card className="mt-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">
              Technical Knowledge Level Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800 transition-colors duration-300">
                <h4 className="font-bold text-red-800 dark:text-red-300 mb-3 text-lg">Beginner (1-2)</h4>
                <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed transition-colors duration-300">
                  No technical background. Needs simple language, step-by-step instructions, and avoidance of technical
                  jargon.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-800 transition-colors duration-300">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 text-lg">Intermediate (3-4)</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed transition-colors duration-300">
                  Some technical understanding. Can handle moderate technical terms with brief explanations.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 transition-colors duration-300">
                <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 text-lg">Advanced (5)</h4>
                <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed transition-colors duration-300">
                  High technical expertise. Comfortable with technical language, APIs, and complex concepts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
