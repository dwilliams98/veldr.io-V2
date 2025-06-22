"use client"

import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [microphoneSupported, setMicrophoneSupported] = useState(false)
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setMicrophoneSupported(true)
        
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognitionRef.current = recognition
      } else {
        setMicrophoneSupported(false)
      }
    }
  }, [])

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

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setMicrophonePermission('granted')
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      setMicrophonePermission('denied')
      return false
    }
  }

  const setupRecognitionHandlers = (
    setInputText: (text: string) => void,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    if (!recognitionRef.current) return

    const recognition = recognitionRef.current

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error)
      }
      
      setIsListening(false)
      
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
          return
        default:
          errorMessage = `Speech recognition error: ${event.error}. Please try again.`
      }
      
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
      setIsListening(false)
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
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        alert('Failed to start speech recognition. Please try again.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  return {
    isListening,
    microphoneSupported,
    microphonePermission,
    checkMicrophonePermission,
    setupRecognitionHandlers,
    startListening,
    stopListening
  }
}