export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  intent?: string
  audioUrl?: string
  isError?: boolean
}

export interface VoiceAssistantProps {
  userType?: 'elder' | 'caregiver' | 'support'
  elderInfo?: {
    name: string
    age: number
    preferences: Record<string, any>
  }
  onIntentDetected?: (intent: string) => void
  className?: string
}

export interface MessageItemProps {
  message: Message
  audioEnabled: boolean
  onPlayAudio: (audioBase64: string) => void
}

export interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  audioEnabled: boolean
  onPlayAudio: (audioBase64: string) => void
  microphoneSupported: boolean
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unknown'
}

export interface InputAreaProps {
  inputText: string
  setInputText: (text: string) => void
  isListening: boolean
  isLoading: boolean
  microphoneSupported: boolean
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unknown'
  onSendMessage: () => void
  onStartListening: () => void
  onStopListening: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export interface VoiceControlsProps {
  audioEnabled: boolean
  setAudioEnabled: (enabled: boolean) => void
  connectionError: boolean
  microphoneSupported: boolean
}