import { type NextRequest, NextResponse } from "next/server"
import { updateClient, deleteClient, getClientById } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await getClientById(params.id)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    return NextResponse.json(client)
  } catch (error) {
    console.error("GET /api/clients/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, technicalKnowledge, description } = body

    const updateData: any = {}
    if (name) updateData.name = name
    if (technicalKnowledge) updateData.technical_knowledge = technicalKnowledge
    if (description !== undefined) updateData.description = description

    const updatedClient = await updateClient(params.id, updateData)
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error("PUT /api/clients/[id] error:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteClient(params.id)
    return NextResponse.json({ message: "Client deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/clients/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
