import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin-session")

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // In a production environment, you would verify the token properly
    // For now, we just check if it exists and is not expired
    try {
      const decoded = Buffer.from(sessionToken.value, "base64").toString()
      const [username, timestamp] = decoded.split(":")
      const tokenAge = Date.now() - Number.parseInt(timestamp)
      const maxAge = 60 * 60 * 24 * 1000 // 24 hours in milliseconds

      if (tokenAge > maxAge) {
        // Token expired
        cookieStore.delete("admin-session")
        return NextResponse.json({ authenticated: false }, { status: 401 })
      }

      return NextResponse.json({ authenticated: true, username })
    } catch (decodeError) {
      // Invalid token format
      cookieStore.delete("admin-session")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
