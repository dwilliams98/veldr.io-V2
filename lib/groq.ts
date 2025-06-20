import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export interface ConversationContext {
  userType: 'elder' | 'caregiver' | 'support'
  elderInfo?: {
    name: string
    age: number
    preferences: Record<string, any>
  }
  conversationHistory: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  intent?: 'support' | 'fraud_alert' | 'general_inquiry' | 'emergency'
}

export const SYSTEM_PROMPTS = {
  ELDER_SUPPORT: `You are Veldr, a compassionate AI assistant designed to help elderly users with fraud protection and general support. 

Key guidelines:
- Speak slowly, clearly, and patiently
- Use simple, non-technical language
- Always prioritize safety and security
- If you detect potential fraud, immediately alert and guide them to safety
- Be warm, respectful, and understanding
- Ask clarifying questions if something seems suspicious
- Provide step-by-step instructions when needed
- Never ask for sensitive information like passwords or SSN

Your primary role is to protect elderly users from scams and provide helpful support.`,

  CUSTOMER_SUPPORT: `You are Veldr's customer support AI, helping caregivers and family members protect their elderly loved ones.

Key guidelines:
- Be professional, knowledgeable, and empathetic
- Understand the stress and concern caregivers feel
- Provide clear explanations about Veldr's features
- Help troubleshoot issues quickly and efficiently
- Escalate to human support when needed
- Maintain privacy and security at all times
- Offer proactive suggestions for better protection

Focus on helping caregivers feel confident that their loved ones are protected.`,

  FRAUD_ALERT: `You are Veldr's fraud alert system. A potential scam or fraud attempt has been detected.

Key guidelines:
- Speak with urgency but remain calm
- Clearly explain the threat that was detected
- Provide immediate action steps
- Do not provide details that could help scammers
- Guide the user to safety
- Offer to connect them with support
- Document the incident for analysis

Your goal is to immediately protect the user from ongoing fraud attempts.`,
}

function getFallbackResponse(context: ConversationContext, message: string): string {
  const responses = {
    elder: {
      fraud_alert: "I understand you may be concerned about a potential scam. For your safety, please hang up any suspicious calls immediately and contact your family or local authorities if you feel threatened. I'm here to help you stay safe.",
      emergency: "If this is an emergency, please call 911 immediately. If you need help with Veldr or have concerns about fraud, I'm here to assist you.",
      support: "I'm here to help you with any questions about staying safe from scams. While I'm having trouble connecting to my main system right now, I can still provide basic safety guidance.",
      general_inquiry: "Hello! I'm Veldr, your safety assistant. While I'm having some technical difficulties right now, I'm still here to help keep you safe from scams and answer basic questions."
    },
    caregiver: {
      fraud_alert: "I understand you're concerned about a potential fraud attempt involving your loved one. Please ensure they're safe and consider contacting authorities if there's an immediate threat. I'll help you document this incident once my systems are fully operational.",
      emergency: "If this is an emergency involving your loved one, please call 911 immediately. For Veldr-related urgent matters, please contact our support team directly.",
      support: "I'm here to help you protect your loved ones. While I'm experiencing some technical difficulties connecting to my main systems, I can still provide basic guidance about fraud protection.",
      general_inquiry: "Hello! I'm here to help you protect your elderly loved ones from fraud. I'm currently experiencing some technical difficulties, but I can still provide basic assistance and safety tips."
    }
  }

  const userType = context.userType === 'support' ? 'caregiver' : context.userType
  const intent = context.intent || 'general_inquiry'
  
  return responses[userType][intent] || responses[userType].general_inquiry
}

export async function generateAIResponse(
  message: string,
  context: ConversationContext
): Promise<string> {
  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not configured')
    return getFallbackResponse(context, message) + "\n\nNote: AI services are currently unavailable due to configuration issues. Please contact support for assistance."
  }

  try {
    const systemPrompt = getSystemPrompt(context)
    
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...context.conversationHistory.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
      stream: false,
    })

    return completion.choices[0]?.message?.content || getFallbackResponse(context, message)
  } catch (error) {
    console.error('Groq API error:', error)
    
    // Provide helpful error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('authentication')) {
        console.error('Authentication failed - check GROQ_API_KEY')
        return getFallbackResponse(context, message) + "\n\nNote: AI services are temporarily unavailable due to authentication issues."
      }
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        console.error('Rate limit exceeded')
        return getFallbackResponse(context, message) + "\n\nNote: AI services are temporarily busy. Please try again in a moment."
      }
      if (error.message.includes('Connection error') || error.message.includes('socket hang up')) {
        console.error('Network connection failed')
        return getFallbackResponse(context, message) + "\n\nNote: AI services are temporarily unavailable due to network issues."
      }
    }
    
    // Generic fallback for any other errors
    return getFallbackResponse(context, message) + "\n\nNote: AI services are temporarily unavailable. Please try again later."
  }
}

function getSystemPrompt(context: ConversationContext): string {
  switch (context.intent) {
    case 'fraud_alert':
      return SYSTEM_PROMPTS.FRAUD_ALERT
    case 'support':
    case 'general_inquiry':
      return context.userType === 'elder' 
        ? SYSTEM_PROMPTS.ELDER_SUPPORT 
        : SYSTEM_PROMPTS.CUSTOMER_SUPPORT
    default:
      return context.userType === 'elder' 
        ? SYSTEM_PROMPTS.ELDER_SUPPORT 
        : SYSTEM_PROMPTS.CUSTOMER_SUPPORT
  }
}

export async function detectIntent(message: string): Promise<ConversationContext['intent']> {
  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not configured for intent detection')
    return detectIntentFallback(message)
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `Analyze the user message and classify the intent. Respond with only one word:
          - "fraud_alert" if the message indicates an ongoing scam or suspicious activity
          - "emergency" if the message indicates immediate danger or urgent help needed
          - "support" if the message is asking for help with the Veldr service
          - "general_inquiry" for general questions or conversation
          
          Message to analyze: "${message}"`
        }
      ],
      max_tokens: 10,
      temperature: 0.1,
      stream: false,
    })

    const intent = completion.choices[0]?.message?.content?.trim().toLowerCase()
    
    if (['fraud_alert', 'emergency', 'support', 'general_inquiry'].includes(intent || '')) {
      return intent as ConversationContext['intent']
    }
    
    return detectIntentFallback(message)
  } catch (error) {
    console.error('Intent detection error:', error)
    return detectIntentFallback(message)
  }
}

function detectIntentFallback(message: string): ConversationContext['intent'] {
  const lowerMessage = message.toLowerCase()
  
  // Simple keyword-based intent detection as fallback
  const fraudKeywords = ['scam', 'fraud', 'suspicious', 'phishing', 'fake', 'steal', 'money', 'bank', 'credit card', 'social security']
  const emergencyKeywords = ['emergency', 'help', 'urgent', 'danger', 'threat', 'police', '911']
  const supportKeywords = ['help', 'support', 'how', 'veldr', 'account', 'settings', 'problem']
  
  if (fraudKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'fraud_alert'
  }
  
  if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'emergency'
  }
  
  if (supportKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'support'
  }
  
  return 'general_inquiry'
}