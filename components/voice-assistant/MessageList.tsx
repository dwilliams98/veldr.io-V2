"use client"

import { useRef, useEffect } from 'react'
import { Bot, Loader2, AlertCircle } from 'lucide-react'
import MessageItem from './MessageItem'
import { MessageListProps } from './types'

export default function MessageList({ 
  messages, 
  isLoading, 
  audioEnabled, 
  onPlayAudio,
  microphoneSupported,
  microphonePermission 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
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
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <p className="text-xs text-orange-600">
                Voice input not supported in this browser. Try Chrome, Edge, or Safari.
              </p>
            </div>
          )}
        </div>
      )}
      
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          audioEnabled={audioEnabled}
          onPlayAudio={onPlayAudio}
        />
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
  )
}