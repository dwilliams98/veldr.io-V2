import { type NextRequest, NextResponse } from "next/server"

// Mock registration endpoint
// In production, this would create a new user in your database
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Mock user creation - replace with real database logic
    // In real app: hash password, save to database, send verification email
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date().toISOString(),
    }

    // Mock JWT token - in production, use proper JWT signing
    const token = "mock_jwt_token_" + Date.now()

    return NextResponse.json(
      {
        token,
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
