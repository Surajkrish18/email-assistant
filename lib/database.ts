import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "email_review_assistant",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export interface Client {
  id: string
  name: string
  technical_knowledge: number
  description: string
  created_at?: string
  updated_at?: string
}

export async function getClients(): Promise<Client[]> {
  try {
    const [rows] = await pool.execute("SELECT * FROM clients ORDER BY name ASC")
    return rows as Client[]
  } catch (error) {
    console.error("Error fetching clients:", error)
    throw new Error("Failed to fetch clients")
  }
}

export async function createClient(client: Omit<Client, "created_at" | "updated_at">): Promise<Client> {
  try {
    await pool.execute("INSERT INTO clients (id, name, technical_knowledge, description) VALUES (?, ?, ?, ?)", [
      client.id,
      client.name,
      client.technical_knowledge,
      client.description,
    ])

    const [rows] = await pool.execute("SELECT * FROM clients WHERE id = ?", [client.id])
    const createdClient = (rows as Client[])[0]
    return createdClient
  } catch (error) {
    console.error("Error creating client:", error)
    throw new Error("Failed to create client")
  }
}

export async function updateClient(
  id: string,
  client: Partial<Omit<Client, "id" | "created_at" | "updated_at">>,
): Promise<Client> {
  try {
    const updateFields = []
    const updateValues = []

    if (client.name !== undefined) {
      updateFields.push("name = ?")
      updateValues.push(client.name)
    }
    if (client.technical_knowledge !== undefined) {
      updateFields.push("technical_knowledge = ?")
      updateValues.push(client.technical_knowledge)
    }
    if (client.description !== undefined) {
      updateFields.push("description = ?")
      updateValues.push(client.description)
    }

    updateValues.push(id)

    await pool.execute(`UPDATE clients SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    const [rows] = await pool.execute("SELECT * FROM clients WHERE id = ?", [id])
    const updatedClient = (rows as Client[])[0]
    return updatedClient
  } catch (error) {
    console.error("Error updating client:", error)
    throw new Error("Failed to update client")
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    await pool.execute("DELETE FROM clients WHERE id = ?", [id])
  } catch (error) {
    console.error("Error deleting client:", error)
    throw new Error("Failed to delete client")
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const [rows] = await pool.execute("SELECT * FROM clients WHERE id = ?", [id])
    const clients = rows as Client[]
    return clients.length > 0 ? clients[0] : null
  } catch (error) {
    console.error("Error fetching client by ID:", error)
    throw new Error("Failed to fetch client")
  }
}
