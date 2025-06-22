"use client"

import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, WifiOff, AlertCircle } from 'lucide-react'
import { VoiceControlsProps } from './types'

export default function VoiceControls({ 
  audioEnabled, 
  setAudioEnabled, 
  connectionError, 
  microphoneSupported 
}: VoiceControlsProps) {
  return (
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
      {connectionError && (
        <WifiOff className="h-4 w-4 text-orange-500" title="Connection issues detected" />
      )}
      {!microphoneSupported && (
        <AlertCircle className="h-4 w-4 text-yellow-500" title="Speech recognition not supported" />
      )}
    </div>
  )
}