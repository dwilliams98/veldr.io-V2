"use client"

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Mic, MicOff, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InputAreaProps } from './types'
import { getMicrophoneButtonTitle } from './utils'

export default function InputArea({
  inputText,
  setInputText,
  isListening,
  isLoading,
  microphoneSupported,
  microphonePermission,
  onSendMessage,
  onStartListening,
  onStopListening,
  onKeyPress
}: InputAreaProps) {
  const micButtonTitle = getMicrophoneButtonTitle(microphoneSupported, microphonePermission, isListening)

  return (
    <div className="flex space-x-2">
      <div className="flex-1 relative">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type your message or click the microphone to speak..."
          className="min-h-[60px] pr-12 resize-none"
          disabled={isLoading}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={isListening ? onStopListening : onStartListening}
          className={cn(
            "absolute right-2 top-2 h-8 w-8 p-0",
            isListening && "text-red-500",
            (!microphoneSupported || microphonePermission === 'denied') && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading || !microphoneSupported || microphonePermission === 'denied'}
          title={micButtonTitle}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
      <Button
        onClick={onSendMessage}
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
  )
}