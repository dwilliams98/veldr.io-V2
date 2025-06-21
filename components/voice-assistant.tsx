"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Bot, 
  User, 
  AlertTriangle,
  Phone,
  MessageCircle,
  Loader2,
  WifiOff,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  intent?: string
  audioUrl?: string
  isError?: boolean
}

interface VoiceAssistantProps {
  userType?: 'elder' | 'caregiver' | 'support'
  elderInfo?: {
    name: string
    age: number
    preferences: Record<string, any>
  }
  onIntentDetected?: (intent: string) => void
  className?: string
}

export default function VoiceAssistant({ 
  userType = 'caregiver', 
  elderInfo,
  onIntentDetected,
  className 
}: VoiceAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [connectionError, setConnectionError] = useState(false)
  const [microphoneSupported, setMicrophoneSupported] = useState(false)
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const [isClient, setIsClient] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Check for speech recognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setMicrophoneSupported(true)
        
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
          console.log('Speech recognition started')
          setIsListening(true)
        }

        recognition.onresult = (event: any) => {
          console.log('Speech recognition result:', event.results)
          const transcript = event.results[0][0].transcript
          setInputText(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          
          // Handle specific error types with user-friendly messages
          let errorMessage = ''
          
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech was detected. Please speak clearly into your microphone and try again.'
              break
            case 'audio-capture':
              errorMessage = 'Unable to access your microphone. Please check your microphone connection and permissions.'
              break
            case 'not-allowed':
              setMicrophonePermission('denied')
              errorMessage = 'Microphone access was denied. Please enable microphone permissions in your browser settings.'
              break
            case 'network':
              errorMessage = 'Network error occurred during speech recognition. Please check your internet connection.'
              break
            case 'aborted':
              // Don't show error for user-initiated stops
              return
            default:
              errorMessage = `Speech recognition error: ${event.error}. Please try again.`
          }
          
          // Add error message to chat
          if (errorMessage) {
            const speechErrorMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: errorMessage,
              timestamp: new Date().toISOString(),
              isError: true,
            }
            setMessages(prev => [...prev, speechErrorMessage])
          }
        }

        recognition.onend = () => {
          console.log('Speech recognition ended')
          setIsListening(false)
        }

        recognitionRef.current = recognition
      } else {
        console.log('Speech recognition not supported')
        setMicrophoneSupported(false)
      }
    }

    return () => {
      if (currentAudio) {
        currentAudio.pause()
      }
    }
  }, [currentAudio])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check microphone permission
  const checkMicrophonePermission = async () => {
    if (!navigator.permissions) {
      setMicrophonePermission('unknown')
      return
    }

    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      setMicrophonePermission(permission.state as any)
      
      permission.onchange = () => {
        setMicrophonePermission(permission.state as any)
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error)
      setMicrophonePermission('unknown')
    }
  }

  useEffect(() => {
    if (isClient) {
      checkMicrophonePermission()
    }
  }, [isClient])

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
      setMicrophonePermission('granted')
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      setMicrophonePermission('denied')
      return false
    }
  }

  const startListening = async () => {
    if (!microphoneSupported) {
      alert('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.')
      return
    }

    if (microphonePermission === 'denied') {
      alert('Microphone access is denied. Please enable microphone permissions in your browser settings.')
      return
    }

    if (microphonePermission !== 'granted') {
      const granted = await requestMicrophonePermission()
      if (!granted) return
    }

    if (recognitionRef.current && !isListening) {
      try {
        console.log('Starting speech recognition...')
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        alert('Failed to start speech recognition. Please try again.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('Stopping speech recognition...')
      recognitionRef.current.stop()
    }
  }

  const playAudio = async (audioBase64: string) => {
    if (!audioEnabled) return

    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause()
      }

      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      )
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      setCurrentAudio(audio)
      await audio.play()
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        setCurrentAudio(null)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)
    setConnectionError(false)

    try {
      console.log('Sending message to API:', userMessage.content)
      
      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          userType,
          elderInfo,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
          generateAudio: audioEnabled,
        }),
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log('API response data:', data)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        intent: data.intent,
        audioUrl: data.audio?.audio,
      }

      setMessages(prev => [...prev, assistantMessage])

      // Play audio response if available
      if (data.audio?.audio) {
        await playAudio(data.audio.audio)
      }

      // Notify parent of intent detection
      if (data.intent && onIntentDetected) {
        onIntentDetected(data.intent)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setConnectionError(true)
      
      let errorContent = 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.'
      
      if (error instanceof Error) {
        if (error.message.includes('503') || error.message.includes('configuration')) {
          errorContent = 'Our AI services are currently being configured. Please try again in a few minutes or contact support for assistance.'
        } else if (error.message.includes('429') || error.message.includes('busy')) {
          errorContent = 'Our services are currently busy. Please wait a moment and try again.'
        } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          errorContent = 'There seems to be a connection issue. Please check your internet connection and try again.'
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString(),
        isError: true,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getIntentBadge = (intent?: string) => {
    switch (intent) {
      case 'fraud_alert':
        return <Badge variant="destructive" className="text-xs">Fraud Alert</Badge>
      case 'emergency':
        return <Badge variant="destructive" className="text-xs">Emergency</Badge>
      case 'support':
        return <Badge variant="secondary" className="text-xs">Support</Badge>
      default:
        return null
    }
  }

  const getMessageIcon = (role: string, intent?: string, isError?: boolean) => {
    if (role === 'user') {
      return <User className="h-4 w-4" />
    }
    
    if (isError) {
      return <WifiOff className="h-4 w-4 text-orange-500" />
    }
    
    switch (intent) {
      case 'fraud_alert':
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'support':
        return <Phone className="h-4 w-4 text-blue-500" />
      default:
        return <Bot className="h-4 w-4 text-primary" />
    }
  }

  const getMicrophoneButtonTitle = () => {
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

  if (!isClient) {
    return null
  }

  return (
    <Card className={cn("flex flex-col h-[600px]", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Veldr Assistant</CardTitle>
            {connectionError && (
              <WifiOff className="h-4 w-4 text-orange-500" title="Connection issues detected" />
            )}
            {!microphoneSupported && (
              <AlertCircle className="h-4 w-4 text-yellow-500" title="Speech recognition not supported" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="h-8 w-8 p-0"
              title={audioEnabled ? "Disable audio responses" : "Enable audio responses"}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {userType === 'elder' 
            ? "I'm here to help keep you safe and answer your questions."
            : "Get support and assistance for protecting your loved ones."
          }
        </p>
        {microphonePermission === 'denied' && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            Microphone access is disabled. Enable it in your browser settings to use voice input.
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="mb-2">Start a conversation by typing or speaking your question.</p>
              {microphoneSupported ? (
                <p className="text-xs">
                  {microphonePermission === 'granted' 
                    ? "Microphone is ready for voice input" 
                    : "Click the microphone to enable voice input"
                  }
                </p>
              ) : (
                <p className="text-xs text-orange-600">
                  Voice input not supported in this browser. Try Chrome, Edge, or Safari.
                </p>
              )}
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex space-x-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.isError ? "bg-orange-100" : "bg-primary/10"
                )}>
                  {getMessageIcon(message.role, message.intent, message.isError)}
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : message.isError
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-muted"
                )}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.intent && getIntentBadge(message.intent)}
                  {message.audioUrl && audioEnabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playAudio(message.audioUrl!)}
                      className="h-6 w-6 p-0"
                      title="Play audio response"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className={cn(
                  "text-sm whitespace-pre-wrap",
                  message.isError && "text-orange-800"
                )}>
                  {message.content}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or click the microphone to speak..."
              className="min-h-[60px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={isListening ? stopListening : startListening}
              className={cn(
                "absolute right-2 top-2 h-8 w-8 p-0",
                isListening && "text-red-500",
                (!microphoneSupported || microphonePermission === 'denied') && "opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading || !microphoneSupported || microphonePermission === 'denied'}
              title={getMicrophoneButtonTitle()}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="h-[60px] px-4"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}