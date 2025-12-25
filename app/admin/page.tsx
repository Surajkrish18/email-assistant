"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Users, Loader2, LogOut } from "lucide-react"
import { Header } from "@/components/header"
import { LoginForm } from "@/components/login-form"

interface Client {
  id: string
  name: string
  technical_knowledge: number
  description: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    technicalKnowledge: 1,
    description: "",
  })

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Load clients when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchClients()
    }
  }, [isAuthenticated])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/verify")
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setIsAuthenticated(false)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsAuthenticated(false)
      setClients([])
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/clients")
      if (response.ok) {
        const clientsData = await response.json()
        setClients(clientsData)
      } else {
        console.error("Failed to fetch clients")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClient = async () => {
    if (!formData.name.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          technicalKnowledge: formData.technicalKnowledge,
          description: formData.description,
        }),
      })

      if (response.ok) {
        const newClient = await response.json()
        setClients([...clients, newClient])
        setFormData({ name: "", technicalKnowledge: 1, description: "" })
      } else {
        console.error("Failed to create client")
      }
    } catch (error) {
      console.error("Error creating client:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClient = (client: Client) => {
    setIsEditing(client.id)
    setFormData({
      name: client.name,
      technicalKnowledge: client.technical_knowledge,
      description: client.description,
    })
  }

  const handleUpdateClient = async () => {
    if (!formData.name.trim() || !isEditing || isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/clients/${isEditing}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          technicalKnowledge: formData.technicalKnowledge,
          description: formData.description,
        }),
      })

      if (response.ok) {
        const updatedClient = await response.json()
        setClients(clients.map((client) => (client.id === isEditing ? updatedClient : client)))
        setIsEditing(null)
        setFormData({ name: "", technicalKnowledge: 1, description: "" })
      } else {
        console.error("Failed to update client")
      }
    } catch (error) {
      console.error("Error updating client:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setClients(clients.filter((client) => client.id !== id))
      } else {
        console.error("Failed to delete client")
      }
    } catch (error) {
      console.error("Error deleting client:", error)
    }
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
    if (level <= 2) return "bg-red-100/80 text-red-800 border-red-200/50 backdrop-blur-sm"
    if (level <= 4) return "bg-yellow-100/80 text-yellow-800 border-yellow-200/50 backdrop-blur-sm"
    return "bg-green-100/80 text-green-800 border-green-200/50 backdrop-blur-sm"
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors font-inter">
      <Header isAdminPage={true} />

      {/* Logout button positioned in top right area */}
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto flex justify-end">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-200/50 hover:bg-red-50/80 text-red-600 hover:text-red-700 backdrop-blur-sm bg-white/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-lg text-gray-600 font-medium">Loading clients...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Add/Edit Client Form */}
            <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
              <CardHeader className="bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-indigo-500/90 text-white rounded-t-lg backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
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
                    className="border-gray-200/50 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm bg-white/50"
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
                    <SelectTrigger className="border-gray-200/50 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-white/20 dark:border-gray-700/20">
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
                    className="resize-none border-gray-200/50 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm bg-white/50"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleUpdateClient}
                        disabled={!formData.name.trim() || isSubmitting}
                        className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 font-semibold"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Updating...
                          </>
                        ) : (
                          "Update Client"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="flex-1 bg-white/50 backdrop-blur-sm border-gray-200/50"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleAddClient}
                      disabled={!formData.name.trim() || isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        "Add Client"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Client List */}
            <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
              <CardHeader className="bg-gradient-to-r from-pink-500/90 via-purple-500/90 to-indigo-500/90 text-white rounded-t-lg backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <Users className="h-6 w-6" />
                  Existing Clients ({clients.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {clients.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                    <p className="text-gray-400 font-medium">
                      Add your first client to get started with personalized email redrafting
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl border border-gray-100/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
                              {client.name}
                            </h3>
                            <Badge className={`${getTechnicalLevelColor(client.technical_knowledge)} border`}>
                              Level {client.technical_knowledge} - {getTechnicalLevelText(client.technical_knowledge)}
                            </Badge>
                          </div>
                          {client.description && (
                            <p className="text-sm text-gray-600 bg-gray-50/80 p-2 rounded-md backdrop-blur-sm border border-gray-200/30">
                              {client.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                            className="hover:bg-purple-50/80 hover:border-purple-200/50 backdrop-blur-sm bg-white/50 border-gray-200/50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                            className="hover:bg-red-50/80 hover:border-red-200/50 hover:text-red-600 backdrop-blur-sm bg-white/50 border-gray-200/50"
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
        )}

        {/* Technical Knowledge Guide */}
        <Card className="mt-8 shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">
              Technical Knowledge Level Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200/50 dark:border-red-800/50 transition-colors duration-300 backdrop-blur-sm">
                <h4 className="font-bold text-red-800 dark:text-red-300 mb-3 text-lg">Beginner (1-2)</h4>
                <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed transition-colors duration-300 font-medium">
                  No technical background. Needs simple language, step-by-step instructions, and avoidance of technical
                  jargon.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-yellow-50/80 to-yellow-100/80 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 transition-colors duration-300 backdrop-blur-sm">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 text-lg">Intermediate (3-4)</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed transition-colors duration-300 font-medium">
                  Some technical understanding. Can handle moderate technical terms with brief explanations.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200/50 dark:border-green-800/50 transition-colors duration-300 backdrop-blur-sm">
                <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 text-lg">Advanced (5)</h4>
                <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed transition-colors duration-300 font-medium">
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
