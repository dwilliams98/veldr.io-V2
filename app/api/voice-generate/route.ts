import { type NextRequest, NextResponse } from "next/server"

// Mock ElevenLabs integration
// In production, this would call the actual ElevenLabs TTS API
export async function POST(request: NextRequest) {
  try {
    const { text, voice_id = "Rachel", ssml } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required for voice generation" }, { status: 400 })
    }

    // Mock ElevenLabs API call
    // In production:
    // 1. Call ElevenLabs TTS API with SSML
    // 2. Get audio file URL
    // 3. Save to VoiceLogs collection

    const mockAudioUrl = `https://api.elevenlabs.io/v1/audio/generated/mock_${Date.now()}.mp3`

    // Mock voice log creation
    const voiceLog = {
      id: Date.now().toString(),
      elderId: "mock_elder_id", // In production: get from request context
      transcript: text,
      audioUrl: mockAudioUrl,
      riskLevel: detectRiskLevel(text),
      timestamp: new Date().toISOString(),
    }

    // In production: save voiceLog to database

    return NextResponse.json({
      audio_url: mockAudioUrl,
      voice_log: voiceLog,
    })
  } catch (error) {
    return NextResponse.json({ error: "Voice generation failed" }, { status: 500 })
  }
}

// Helper function to detect risk level based on transcript content
function detectRiskLevel(text: string): "Safe" | "Warning" | "Critical" {
  const criticalKeywords = ["social security", "bank account", "credit card", "wire transfer", "urgent payment"]
  const warningKeywords = ["medicare", "insurance", "benefits", "personal information", "verify"]

  const lowerText = text.toLowerCase()

  if (criticalKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "Critical"
  }

  if (warningKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "Warning"
  }

  return "Safe"
}
