import { NextRequest, NextResponse } from 'next/server'
import { generateSpeech, VOICE_IDS, VOICE_SETTINGS } from '@/lib/elevenlabs'

export async function POST(request: NextRequest) {
  try {
    const { text, voiceType = 'customer_support', urgency = 'normal' } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Select voice and settings based on type and urgency
    let voiceId = VOICE_IDS.CUSTOMER_SUPPORT
    let settings = VOICE_SETTINGS.CONVERSATIONAL

    switch (voiceType) {
      case 'elder_support':
        voiceId = VOICE_IDS.ELDER_SUPPORT
        settings = VOICE_SETTINGS.CALM
        break
      case 'fraud_alert':
        voiceId = VOICE_IDS.FRAUD_ALERT
        settings = VOICE_SETTINGS.ALERT
        break
      case 'notification':
        voiceId = VOICE_IDS.NOTIFICATION
        settings = VOICE_SETTINGS.CONVERSATIONAL
        break
    }

    // Adjust settings based on urgency
    if (urgency === 'high') {
      settings = { ...settings, stability: 0.8, style: 0.6 }
    }

    const audioBuffer = await generateSpeech({
      text,
      voiceId,
      settings,
    })

    // Return audio as base64 for easy frontend handling
    const audioBase64 = audioBuffer.toString('base64')

    return NextResponse.json({
      audio: audioBase64,
      mimeType: 'audio/mpeg',
      text,
      voiceType,
    })
  } catch (error) {
    console.error('Voice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate voice audio' },
      { status: 500 }
    )
  }
}