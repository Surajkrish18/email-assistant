import { type NextRequest, NextResponse } from "next/server"
import { getClients, createClient } from "@/lib/database"

export async function GET() {
  try {
    const clients = await getClients()
    return NextResponse.json(clients)
  } catch (error) {
    console.error("GET /api/clients error:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, technicalKnowledge, description } = body

    if (!name || !technicalKnowledge) {
      return NextResponse.json({ error: "Name and technical knowledge are required" }, { status: 400 })
    }

    const newClient = {
      id: Date.now().toString(),
      name,
      technical_knowledge: technicalKnowledge,
      description: description || "",
    }

    const createdClient = await createClient(newClient)
    return NextResponse.json(createdClient, { status: 201 })
  } catch (error) {
    console.error("POST /api/clients error:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
