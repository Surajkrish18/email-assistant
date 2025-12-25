import { bedrock } from "@ai-sdk/amazon-bedrock"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { originalEmail, context, prompt, client, bilingualOutput } = await req.json()

    console.log("API received request:", {
      hasEmail: !!originalEmail,
      hasPrompt: !!prompt,
      hasClient: !!client,
      bilingualOutput: !!bilingualOutput,
      emailLength: originalEmail?.length || 0,
    })

    if (!originalEmail?.trim()) {
      console.error("No email content provided")
      return new Response("No email content provided", { status: 400 })
    }

    if (!prompt?.trim()) {
      console.error("No prompt provided")
      return new Response("No prompt provided", { status: 400 })
    }

    // Build technical knowledge context
    let technicalContext = ""
    if (client) {
      const technicalLevel = client.technicalKnowledge
      if (technicalLevel <= 2) {
        technicalContext = `The recipient (${client.name}) has beginner-level technical knowledge. Use simple, non-technical language and provide step-by-step explanations. Avoid jargon and technical acronyms.`
      } else if (technicalLevel <= 4) {
        technicalContext = `The recipient (${client.name}) has intermediate technical knowledge. You can use some technical terms but provide brief explanations when needed.`
      } else {
        technicalContext = `The recipient (${client.name}) has advanced technical knowledge. You can use technical language and assume familiarity with complex concepts.`
      }
    }

    const systemPrompt = `You are an expert email communication coach. Your task is to redraft emails based on the specific instructions provided by the user.

Context: ${context || "General business correspondence"}

${technicalContext ? `Recipient Technical Level: ${technicalContext}` : ""}

User Instructions: ${prompt}

Guidelines:
- Follow the user's instructions precisely
- Maintain the core message and intent of the original email
- Ensure the redrafted email is professional and well-structured
${bilingualOutput ? "- Provide TWO complete versions of the redrafted email: one in English and one in Portuguese (Brazil)\n- Format: First show the English version with a clear heading '=== ENGLISH VERSION ===', then show the Portuguese version with heading '=== VERSÃO EM PORTUGUÊS ==='\n- Both versions should be complete, professional redrafts following all the instructions" : "- Only provide the redrafted email - no analysis, scores, or explanations"}
- Consider the recipient's technical knowledge level when choosing language and explanations`

    console.log("Calling Bedrock with system prompt length:", systemPrompt.length)

    const result = streamText({
      model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Please redraft this email based on the instructions provided:

Original Email:
"""
${originalEmail}
"""

${bilingualOutput ? "Provide both English and Portuguese versions with clear headings as specified in the guidelines." : "Provide only the redrafted email."}`,
        },
      ],
    })

    console.log("Bedrock call successful, returning stream")

    // Use the correct AI SDK streaming method
    return result.toTextStreamResponse()
  } catch (error) {
    console.error("API Route Error:", error)
    return new Response(`Server Error: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    })
  }
}
