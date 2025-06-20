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

export async function generateAIResponse(
  message: string,
  context: ConversationContext
): Promise<string> {
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

    return completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now. Please try again or contact support.'
  } catch (error) {
    console.error('Groq API error:', error)
    throw new Error('Failed to generate AI response')
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
    
    return 'general_inquiry'
  } catch (error) {
    console.error('Intent detection error:', error)
    return 'general_inquiry'
  }
}