import { type NextRequest, NextResponse } from "next/server"

// Mock voice logs data - in production, this would come from your database
const mockVoiceLogs = [
  {
    id: "1",
    elderId: "1",
    transcript:
      "We detected a suspicious call. The caller was asking for your Social Security number and bank account details. This appears to be a scam attempt.",
    audioUrl: "https://api.elevenlabs.io/v1/audio/generated/mock1.mp3",
    riskLevel: "Critical",
    timestamp: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    elderId: "1",
    transcript:
      "A caller mentioned Medicare benefits and asked for personal information. We are monitoring this as potentially suspicious.",
    audioUrl: "https://api.elevenlabs.io/v1/audio/generated/mock2.mp3",
    riskLevel: "Warning",
    timestamp: "2024-01-15T10:15:00Z",
  },
  {
    id: "3",
    elderId: "1",
    transcript: "Regular family call detected. No suspicious activity identified.",
    audioUrl: "https://api.elevenlabs.io/v1/audio/generated/mock3.mp3",
    riskLevel: "Safe",
    timestamp: "2024-01-14T16:20:00Z",
  },
]

// GET /api/voice-logs/[elderId] - Fetch voice logs for specific elder
export async function GET(request: NextRequest, { params }: { params: Promise<{ elderId: string }> }) {
  try {
    const { elderId } = await params

    // In production: verify JWT token, check caregiver access to elder
    const elderLogs = mockVoiceLogs.filter((log) => log.elderId === elderId)

    // Sort by timestamp (newest first)
    elderLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json(elderLogs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch voice logs" }, { status: 500 })
  }
}
