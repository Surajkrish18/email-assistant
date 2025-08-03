"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, CheckCircle, Sparkles, Zap, Brain, Copy, Check } from "lucide-react"
import { Header } from "@/components/header" // Import the new Header component

interface Client {
  id: string
  name: string
  technicalKnowledge: number
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
  const [copied, setCopied] = useState(false)

  // Load clients from localStorage on component mount
  useEffect(() => {
    const savedClients = localStorage.getItem("emailReviewClients")
    if (savedClients) {
      setClients(JSON.parse(savedClients))
    }
  }, [])

  const handleCopyToClipboard = async () => {
    if (!result) return
    
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }
  const handleReviewEmail = async () => {
    if (!originalEmail.trim() || !prompt.trim()) return

    // Clear previous result
    setResult("")
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

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        console.log("Received chunk:", chunk)

        // Parse the AI SDK streaming format
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.trim() === "") continue

          // Handle text content lines that start with "0:"
          if (line.startsWith("0:")) {
            const jsonStr = line.slice(2)
            try {
              const textContent = JSON.parse(jsonStr)
              if (typeof textContent === "string") {
                accumulatedResult += textContent
                setResult(accumulatedResult)
              }
            } catch (e) {
              // If it's not valid JSON, treat it as plain text
              const textContent = jsonStr.replace(/^"|"$/g, "")
              accumulatedResult += textContent
              setResult(accumulatedResult)
            }
          }
          // Skip metadata lines that start with "d:", "e:", "f:", etc.
          else if (line.match(/^[a-z]:/)) {
            console.log("Skipping metadata line:", line)
            continue
          }
        }
      }

      if (!accumulatedResult) {
        throw new Error("No content received from API")
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 transition-all duration-700">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-violet-500/5 to-blue-500/5 pointer-events-none"></div>
      <Header /> {/* Use the new Header component */}
      <div className="max-w-7xl mx-auto pt-20">
        {" "}
        {/* Added pt-20 for spacing below fixed header */}
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Mail className="h-12 w-12 text-indigo-600 dark:text-indigo-400 drop-shadow-lg" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce drop-shadow-md" />
            </div>
            <h1 className="fluid-text font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent text-animate">
              Email Review Assistant
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed transition-all duration-500 hover:text-slate-700 dark:hover:text-slate-200">
            Transform your emails with AI-powered redrafting using{" "}
            <span className="font-semibold gradient-text">AWS Bedrock Claude 3</span>
            <br />
            Customize based on your prompts and client technical knowledge
          </p>

          {/* Feature highlights */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:scale-105">
              <Brain className="h-5 w-5" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 transition-all duration-300 hover:scale-105">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Real-time</span>
            </div>
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 transition-all duration-300 hover:scale-105">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Personalized</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="glass-card shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20"></div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <MessageSquare className="h-6 w-6" />
                Email Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label
                  htmlFor="context"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300"
                >
                  Context <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="context"
                  placeholder="e.g., Customer complaint response, Technical support, Sales inquiry..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="glass-card border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 dark:border-slate-600 dark:text-white transition-all duration-300 hover:shadow-md"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="client"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300"
                >
                  Client <span className="text-gray-400">(Optional)</span>
                </Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="glass-card border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 dark:border-slate-600 dark:text-white transition-all duration-300 hover:shadow-md">
                    <SelectValue placeholder="Select a client to customize technical level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">No specific client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {getTechnicalLevelText(client.technicalKnowledge)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedClient !== "default" && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 p-2 glass-card rounded-md transition-colors duration-300">
                    💡 {clients.find((c) => c.id === selectedClient)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="prompt"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300"
                >
                  Instructions for Claude <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Tell Claude what to do with the email (e.g., Make it more professional and empathetic, Simplify technical terms, Add urgency, etc.)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none glass-card border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 dark:border-slate-600 dark:text-white transition-all duration-300 hover:shadow-md"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300"
                >
                  Original Email Draft <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="email"
                  placeholder="Paste your email draft here..."
                  value={originalEmail}
                  onChange={(e) => setOriginalEmail(e.target.value)}
                  rows={12}
                  className="resize-none glass-card border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 dark:border-slate-600 dark:text-white transition-all duration-300 hover:shadow-md"
                />
              </div>

              <Button
                onClick={handleReviewEmail}
                disabled={!originalEmail.trim() || !prompt.trim() || isAnalyzing}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] neo-brutal-shadow hover:neo-brutal-shadow"
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
          <Card className="glass-card shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20"></div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <CheckCircle className="h-6 w-6" />
                Redrafted Email
                {result && (
                  <Button
                    onClick={handleCopyToClipboard}
                    variant="ghost"
                    size="sm"
                    className={`ml-auto text-white hover:bg-white/20 transition-all duration-300 ${copied ? 'copy-success' : ''}`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {!result && !isAnalyzing ? (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  <div className="relative mb-6">
                    <Mail className="h-20 w-20 mx-auto opacity-30" />
                    <Sparkles className="h-8 w-8 text-yellow-400 absolute top-0 right-1/2 translate-x-8 animate-bounce drop-shadow-md" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Transform Your Email</h3>
                  <p className="text-slate-400">
                    Enter your email draft and instructions, then click "Redraft Email" to see the magic happen
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {result && (
                    <div className="glass-card p-6 rounded-xl shadow-inner transition-all duration-300 hover:shadow-lg">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200 transition-colors duration-300">
                        {result}
                      </div>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="flex flex-col items-center gap-4 py-12">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                        <Brain className="h-6 w-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-1 transition-colors duration-300 text-animate">
                          AI is working its magic
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
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
          <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
            Powered by <span className="font-semibold gradient-text">AWS Bedrock</span> and{" "}
            <span className="font-semibold gradient-text">Claude 3</span>
          </p>
        </div>
      </div>
    </div>
  )
}
