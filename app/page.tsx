"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, CheckCircle, Sparkles, Zap, Brain, Copy, Check } from "lucide-react"
import { Header } from "@/components/header"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

interface Client {
  id: string
  name: string
  technical_knowledge: number
  description: string
}

export default function EmailReviewChatbot() {
  const [originalEmail, setOriginalEmail] = useState("")
  const [context, setContext] = useState("")
  const [prompt, setPrompt] = useState("")
  const [selectedClient, setSelectedClient] = useState("default")
  const [clients, setClients] = useState<Client[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState("")
  const { copy, copied, reset: resetCopyStatus } = useCopyToClipboard()

  // Load clients from database on component mount
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const clientsData = await response.json()
        setClients(clientsData)
      } else {
        console.error("Failed to fetch clients")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!result.trim() || result.startsWith("Error:")) return

    const success = await copy(result)
    if (success) {
      console.log("Content copied successfully")
    } else {
      console.error("Failed to copy content")
    }
  }

  const handleReviewEmail = async () => {
    if (!originalEmail.trim() || !prompt.trim()) return

    // Clear previous result and copy status
    setResult("")
    resetCopyStatus()
    setIsAnalyzing(true)

    try {
      const selectedClientData = clients.find((client) => client.id === selectedClient)

      console.log("Sending request with:", {
        originalEmail: originalEmail.substring(0, 100) + "...",
        context,
        prompt,
        client: selectedClientData?.name || "No client",
      })

      const response = await fetch("/api/review-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalEmail,
          context,
          prompt,
          client: selectedClientData,
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      let accumulatedResult = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        console.log("Received chunk:", chunk)

        // For toTextStreamResponse(), the content comes as plain text
        accumulatedResult += chunk
        setResult(accumulatedResult)
      }

      if (!accumulatedResult.trim()) {
        throw new Error("No content received from API")
      }

      console.log("Final result:", accumulatedResult)
    } catch (error) {
      console.error("Error:", error)
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}. Please check the console for details.`,
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getTechnicalLevelText = (level: number) => {
    if (level <= 2) return "Beginner (Non-technical)"
    if (level <= 4) return "Intermediate (Some technical knowledge)"
    return "Advanced (High technical expertise)"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors font-inter">
      <Header />

      {/* Feature highlights - moved to top */}
      <div className="text-center pt-20 pb-8">
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 transition-colors duration-300">
            <Brain className="h-5 w-5" />
            <span className="font-medium">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 transition-colors duration-300">
            <Zap className="h-5 w-5" />
            <span className="font-medium">Real-time</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Personalized</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-indigo-500/90 text-white rounded-t-lg backdrop-blur-sm">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <MessageSquare className="h-6 w-6" />
                Email Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label
                  htmlFor="context"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Context <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="context"
                  placeholder="e.g., Customer complaint response, Technical support, Sales inquiry..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="border-gray-200/50 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="client"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Client <span className="text-gray-400">(Optional)</span>
                </Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="border-gray-200/50 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm bg-white/50">
                    <SelectValue placeholder="Select a client to customize technical level" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-white/20 dark:border-gray-700/20">
                    <SelectItem value="default">No specific client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {getTechnicalLevelText(client.technical_knowledge)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedClient !== "default" && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 p-3 bg-purple-50/80 dark:bg-purple-900/20 rounded-lg transition-colors duration-300 backdrop-blur-sm border border-purple-200/30 dark:border-purple-800/30">
                    💡 {clients.find((c) => c.id === selectedClient)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="prompt"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Instructions for Claude <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Tell Claude what to do with the email (e.g., Make it more professional and empathetic, Simplify technical terms, Add urgency, etc.)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none border-gray-200/50 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Original Email Draft <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="email"
                  placeholder="Paste your email draft here..."
                  value={originalEmail}
                  onChange={(e) => setOriginalEmail(e.target.value)}
                  rows={12}
                  className="resize-none border-gray-200/50 focus:border-purple-400 focus:ring-purple-400/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm bg-white/50"
                />
              </div>

              <Button
                onClick={handleReviewEmail}
                disabled={!originalEmail.trim() || !prompt.trim() || isAnalyzing}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Redrafting with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-3" />
                    Redraft Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
            <CardHeader className="bg-gradient-to-r from-pink-500/90 via-purple-500/90 to-indigo-500/90 text-white rounded-t-lg backdrop-blur-sm">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <CheckCircle className="h-6 w-6" />
                Redrafted Email
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {!result && !isAnalyzing ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <div className="relative mb-6">
                    <MessageSquare className="h-20 w-20 mx-auto opacity-30" />
                    <Sparkles className="h-8 w-8 text-pink-400 absolute top-0 right-1/2 translate-x-8 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Transform Your Email</h3>
                  <p className="text-gray-400">
                    Enter your email draft and instructions, then click "Redraft Email" to see the magic happen
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {result && (
                    <div className="bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-700/80 dark:to-gray-800/80 p-6 rounded-xl border border-gray-100/50 dark:border-gray-600/50 shadow-inner transition-colors duration-300 backdrop-blur-sm">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 transition-colors duration-300 font-medium">
                        {result}
                      </div>
                      {result.trim() && !result.startsWith("Error:") && (
                        <Button
                          onClick={handleCopyToClipboard}
                          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="flex flex-col items-center gap-4 py-12">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                        <Brain className="h-6 w-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-1 transition-colors duration-300">
                          AI is working its magic
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Analyzing and redrafting your email...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">
            Powered by <span className="font-semibold text-purple-600 dark:text-purple-400">AWS Bedrock</span> and{" "}
            <span className="font-semibold text-pink-600 dark:text-pink-400">Claude 3</span>
          </p>
        </div>
      </div>
    </div>
  )
}
