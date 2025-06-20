import { ElevenLabsClient } from 'elevenlabs'

// ElevenLabs configuration
const config = {
  apiKey: process.env.ELEVENLABS_API_KEY || '',
}

export const elevenlabs = new ElevenLabsClient(config)

// Voice IDs for different use cases
export const VOICE_IDS = {
  // Professional, calm voice for elder assistance
  ELDER_SUPPORT: process.env.ELEVENLABS_ELDER_VOICE_ID || 'pNInz6obpgDQGcFmaJgB', // Adam
  
  // Warm, friendly voice for customer support
  CUSTOMER_SUPPORT: process.env.ELEVENLABS_CUSTOMER_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL', // Bella
  
  // Alert voice for fraud warnings
  FRAUD_ALERT: process.env.ELEVENLABS_ALERT_VOICE_ID || 'VR6AewLTigWG4xSOukaG', // Arnold
  
  // Gentle voice for notifications
  NOTIFICATION: process.env.ELEVENLABS_NOTIFICATION_VOICE_ID || 'pqHfZKP75CvOlQylNhV4', // Bill
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
    const audio = await elevenlabs.generate({
      voice: voiceId,
      text,
      model_id: model,
      voice_settings: settings,
    })

    // Convert the audio stream to a buffer
    const chunks: Buffer[] = []
    for await (const chunk of audio) {
      chunks.push(chunk)
    }
    
    return Buffer.concat(chunks)
  } catch (error) {
    console.error('ElevenLabs speech generation error:', error)
    throw new Error('Failed to generate speech')
  }
}

export async function getAvailableVoices() {
  try {
    const voices = await elevenlabs.voices.getAll()
    return voices.voices
  } catch (error) {
    console.error('Error fetching voices:', error)
    throw new Error('Failed to fetch available voices')
  }
}