"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Bot, 
  AlertTriangle, 
  Phone, 
  WifiOff, 
  Volume2 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MessageItemProps } from './types'
import { getIntentBadge, getMessageIcon, formatTimestamp } from './utils'

const iconComponents = {
  User,
  Bot,
  AlertTriangle,
  Phone,
  WifiOff,
}

export default function MessageItem({ message, audioEnabled, onPlayAudio }: MessageItemProps) {
  const intentBadge = getIntentBadge(message.intent)
  const messageIcon = getMessageIcon(message.role, message.intent, message.isError)
  const IconComponent = iconComponents[messageIcon.icon as keyof typeof iconComponents]

  return (
    <div
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
          <IconComponent className={messageIcon.className} />
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
          {intentBadge && (
            <Badge variant={intentBadge.variant} className="text-xs">
              {intentBadge.label}
            </Badge>
          )}
          {message.audioUrl && audioEnabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPlayAudio(message.audioUrl!)}
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
          {formatTimestamp(message.timestamp)}
        </p>
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}