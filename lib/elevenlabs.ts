// Mock ElevenLabs integration for development
// In production, you would use the actual ElevenLabs SDK

export const VOICE_IDS = {
  // Professional, calm voice for elder assistance
  ELDER_SUPPORT: 'pNInz6obpgDQGcFmaJgB', // Adam
  
  // Warm, friendly voice for customer support
  CUSTOMER_SUPPORT: 'EXAVITQu4vr4xnSDxMaL', // Bella
  
  // Alert voice for fraud warnings
  FRAUD_ALERT: 'VR6AewLTigWG4xSOukaG', // Arnold
  
  // Gentle voice for notifications
  NOTIFICATION: 'pqHfZKP75CvOlQylNhV4', // Bill
}

// Voice settings for different scenarios
export const VOICE_SETTINGS = {
  CONVERSATIONAL: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true,
  },
  ALERT: {
    stability: 0.8,
    similarity_boost: 0.8,
    style: 0.3,
    use_speaker_boost: true,
  },
  CALM: {
    stability: 0.7,
    similarity_boost: 0.7,
    style: 0.2,
    use_speaker_boost: false,
  },
}

export interface VoiceGenerationOptions {
  text: string
  voiceId?: string
  settings?: typeof VOICE_SETTINGS.CONVERSATIONAL
  model?: 'eleven_monolingual_v1' | 'eleven_multilingual_v2' | 'eleven_turbo_v2'
}

export async function generateSpeech(options: VoiceGenerationOptions): Promise<Buffer> {
  const {
    text,
    voiceId = VOICE_IDS.CUSTOMER_SUPPORT,
    settings = VOICE_SETTINGS.CONVERSATIONAL,
    model = 'eleven_turbo_v2'
  } = options

  try {
    // Mock implementation - returns a small audio buffer
    // In production, this would call the actual ElevenLabs API
    console.log(`Mock: Generating speech for text: "${text}" with voice: ${voiceId}`)
    
    // Return a mock audio buffer (empty for now)
    return Buffer.from('mock-audio-data')
  } catch (error) {
    console.error('ElevenLabs speech generation error:', error)
    throw new Error('Failed to generate speech')
  }
}

export async function getAvailableVoices() {
  try {
    // Mock implementation
    return [
      { voice_id: VOICE_IDS.ELDER_SUPPORT, name: 'Adam' },
      { voice_id: VOICE_IDS.CUSTOMER_SUPPORT, name: 'Bella' },
      { voice_id: VOICE_IDS.FRAUD_ALERT, name: 'Arnold' },
      { voice_id: VOICE_IDS.NOTIFICATION, name: 'Bill' },
    ]
  } catch (error) {
    console.error('Error fetching voices:', error)
    throw new Error('Failed to fetch available voices')
  }
}