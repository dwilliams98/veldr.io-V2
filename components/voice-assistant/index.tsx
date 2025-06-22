"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import MessageList from './MessageList'
import InputArea from './InputArea'
import VoiceControls from './VoiceControls'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useAudioPlayback } from './hooks/useAudioPlayback'
import { VoiceAssistantProps, Message } from './types'

export default function VoiceAssistant({ 
  userType = 'caregiver', 
  elderInfo,
  onIntentDetected,
  className 
}: VoiceAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [connectionError, setConnectionError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const {
    isListening,
    microphoneSupported,
    microphonePermission,
    checkMicrophonePermission,
    setupRecognitionHandlers,
    startListening,
    stopListening
  } = useSpeechRecognition()

  const { playAudio, cleanup } = useAudioPlayback()

  useEffect(() => {
    setIsClient(true)
    setupRecognitionHandlers(setInputText, setMessages)
    return cleanup
  }, [])

  useEffect(() => {
    if (isClient) {
      checkMicrophonePermission()
    }
  }, [isClient])

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
          })),
          generateAudio: audioEnabled,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        intent: data.intent,
        audioUrl: data.audio?.audio,
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.audio?.audio) {
        await playAudio(data.audio.audio)
      }

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
          </div>
          <VoiceControls
            audioEnabled={audioEnabled}
            setAudioEnabled={setAudioEnabled}
            connectionError={connectionError}
            microphoneSupported={microphoneSupported}
          />
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
        <MessageList
          messages={messages}
          isLoading={isLoading}
          audioEnabled={audioEnabled}
          onPlayAudio={playAudio}
          microphoneSupported={microphoneSupported}
          microphonePermission={microphonePermission}
        />

        <InputArea
          inputText={inputText}
          setInputText={setInputText}
          isListening={isListening}
          isLoading={isLoading}
          microphoneSupported={microphoneSupported}
          microphonePermission={microphonePermission}
          onSendMessage={sendMessage}
          onStartListening={startListening}
          onStopListening={stopListening}
          onKeyPress={handleKeyPress}
        />
      </CardContent>
    </Card>
  )
}