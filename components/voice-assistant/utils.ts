import { Message } from './types'

export const getIntentBadge = (intent?: string) => {
  switch (intent) {
    case 'fraud_alert':
      return { variant: 'destructive' as const, label: 'Fraud Alert' }
    case 'emergency':
      return { variant: 'destructive' as const, label: 'Emergency' }
    case 'support':
      return { variant: 'secondary' as const, label: 'Support' }
    default:
      return null
  }
}

export const getMessageIcon = (role: string, intent?: string, isError?: boolean) => {
  if (role === 'user') {
    return { icon: 'User', className: 'h-4 w-4' }
  }
  
  if (isError) {
    return { icon: 'WifiOff', className: 'h-4 w-4 text-orange-500' }
  }
  
  switch (intent) {
    case 'fraud_alert':
    case 'emergency':
      return { icon: 'AlertTriangle', className: 'h-4 w-4 text-red-500' }
    case 'support':
      return { icon: 'Phone', className: 'h-4 w-4 text-blue-500' }
    default:
      return { icon: 'Bot', className: 'h-4 w-4 text-primary' }
  }
}

export const getMicrophoneButtonTitle = (
  microphoneSupported: boolean,
  microphonePermission: string,
  isListening: boolean
) => {
  if (!microphoneSupported) {
    return 'Speech recognition not supported in this browser'
  }
  if (microphonePermission === 'denied') {
    return 'Microphone access denied. Please enable in browser settings.'
  }
  if (isListening) {
    return 'Click to stop listening'
  }
  return 'Click to start voice input'
}

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString()
}