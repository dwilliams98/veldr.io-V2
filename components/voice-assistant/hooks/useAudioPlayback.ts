"use client"

import { useState } from 'react'

export function useAudioPlayback() {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  const playAudio = async (audioBase64: string) => {
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

  const cleanup = () => {
    if (currentAudio) {
      currentAudio.pause()
    }
  }

  return {
    playAudio,
    cleanup
  }
}