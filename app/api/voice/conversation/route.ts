import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, detectIntent, ConversationContext } from '@/lib/groq'
import { generateSpeech, VOICE_IDS, VOICE_SETTINGS } from '@/lib/elevenlabs'

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      userType = 'caregiver',
      elderInfo,
      conversationHistory = [],
      generateAudio = true 
    } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Detect intent from the message
    const intent = await detectIntent(message)

    // Build conversation context
    const context: ConversationContext = {
      userType,
      elderInfo,
      conversationHistory,
      intent,
    }

    // Generate AI response
    let aiResponse: string
    try {
      aiResponse = await generateAIResponse(message, context)
    } catch (error) {
      console.error('AI response generation failed:', error)
      // Provide a helpful fallback response
      aiResponse = "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or contact our support team if you need immediate assistance."
    }

    // Generate audio if requested
    let audioData = null
    if (generateAudio) {
      try {
        // Check if ElevenLabs API key is configured
        if (!process.env.ELEVENLABS_API_KEY) {
          console.warn('ELEVENLABS_API_KEY is not configured - skipping audio generation')
        } else {
          // Select appropriate voice based on context
          let voiceId = VOICE_IDS.CUSTOMER_SUPPORT
          let settings = VOICE_SETTINGS.CONVERSATIONAL

          if (userType === 'elder') {
            voiceId = VOICE_IDS.ELDER_SUPPORT
            settings = VOICE_SETTINGS.CALM
          }

          if (intent === 'fraud_alert' || intent === 'emergency') {
            voiceId = VOICE_IDS.FRAUD_ALERT
            settings = VOICE_SETTINGS.ALERT
          }

          const audioBuffer = await generateSpeech({
            text: aiResponse,
            voiceId,
            settings,
          })

          audioData = {
            audio: audioBuffer.toString('base64'),
            mimeType: 'audio/mpeg',
          }
        }
      } catch (audioError) {
        console.error('Audio generation failed:', audioError)
        // Continue without audio if generation fails
      }
    }

    // Update conversation history
    const updatedHistory = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      response: aiResponse,
      intent,
      audio: audioData,
      conversationHistory: updatedHistory,
      suggestions: generateSuggestions(intent, userType),
    })
  } catch (error) {
    console.error('Conversation API error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to process conversation'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Service configuration error. Please contact support.'
        statusCode = 503
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Service temporarily busy. Please try again in a moment.'
        statusCode = 429
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.'
        statusCode = 503
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

function generateSuggestions(intent: string, userType: string): string[] {
  const suggestions: Record<string, string[]> = {
    elder: {
      general_inquiry: [
        "How can I stay safe from phone scams?",
        "What should I do if someone asks for my personal information?",
        "Can you help me understand this email I received?",
      ],
      fraud_alert: [
        "I think someone is trying to scam me",
        "I received a suspicious phone call",
        "Help me report this fraud attempt",
      ],
      support: [
        "How do I contact my family?",
        "I need help with my account",
        "Can you explain how Veldr protects me?",
      ],
    },
    caregiver: {
      general_inquiry: [
        "How can I better protect my loved one?",
        "What are the latest scam trends?",
        "How do I set up additional monitoring?",
      ],
      support: [
        "How do I add another elder to my account?",
        "Can I customize alert settings?",
        "How do I view recent activity?",
      ],
      fraud_alert: [
        "My elder received a suspicious call",
        "I want to report a scam attempt",
        "How do I increase protection levels?",
      ],
    },
  }

  return suggestions[userType]?.[intent] || suggestions[userType]?.general_inquiry || []
}