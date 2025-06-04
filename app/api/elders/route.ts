import { type NextRequest, NextResponse } from "next/server"

// Mock elders data - in production, this would come from your database
const mockElders = [
  {
    id: "1",
    name: "Margaret Johnson",
    photoURL: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+1-555-0123",
    age: 78,
    relationship: "Mother",
    preferences: {
      preferredLanguage: "English",
      timeZone: "EST",
    },
    caregivers: ["user_1"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "2",
    name: "Robert Smith",
    photoURL: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+1-555-0456",
    age: 82,
    relationship: "Father-in-law",
    preferences: {
      preferredLanguage: "English",
      timeZone: "PST",
    },
    caregivers: ["user_1"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
]

// GET /api/elders - List all elders for authenticated caregiver
export async function GET(request: NextRequest) {
  try {
    // In production: verify JWT token, get user ID, filter elders by caregiver
    return NextResponse.json(mockElders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch elders" }, { status: 500 })
  }
}

// POST /api/elders - Create new elder profile
export async function POST(request: NextRequest) {
  try {
    const elderData = await request.json()

    // Validation
    if (!elderData.name || !elderData.phoneNumber) {
      return NextResponse.json({ error: "Name and phone number are required" }, { status: 400 })
    }

    // Mock elder creation
    const newElder = {
      id: Date.now().toString(),
      ...elderData,
      caregivers: ["user_1"], // In production: get from JWT token
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(newElder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create elder profile" }, { status: 500 })
  }
}
