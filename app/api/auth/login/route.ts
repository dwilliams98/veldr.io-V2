import { type NextRequest, NextResponse } from "next/server"

// Mock authentication endpoint
// In production, this would validate credentials against your database
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock validation - replace with real authentication logic
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock user lookup and password verification
    // In real app: hash password, compare with stored hash, generate JWT
    const mockUser = {
      id: "1",
      email: email,
      name: "John Doe",
    }

    // Mock JWT token - in production, use proper JWT signing
    const token = "mock_jwt_token_" + Date.now()

    return NextResponse.json({
      token,
      user: mockUser,
    })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
