import { NextRequest, NextResponse } from "next/server"

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "Low" | "Medium" | "High"

interface ScamResult {
  riskLevel: RiskLevel
  score: number
  explanation: string
  suggestions: string[]
  flaggedPatterns: string[]
}

// ─── Detection Rules ──────────────────────────────────────────────────────────
// Each rule carries a weight (1-3) so multiple weak signals can compound.
// This logic is intentionally transparent and unit-testable (SOLID: SRP).

interface DetectionRule {
  pattern: RegExp
  label: string      // shown in flaggedPatterns
  weight: number     // contribution toward the 0-100 score
}

const DETECTION_RULES: DetectionRule[] = [
  // Urgency / pressure tactics
  { pattern: /urgent|immediately|act now|limited time|expires? (today|soon)/i, label: "Urgency language", weight: 15 },
  { pattern: /within \d+ (hours?|days?|minutes?)/i, label: "Time pressure", weight: 10 },

  // Financial lures
  { pattern: /you('ve| have) (won|been selected|been chosen)/i, label: "Prize claim", weight: 20 },
  { pattern: /\$[\d,]+\s*(reward|gift|prize|cash|bonus)/i, label: "Financial lure", weight: 18 },
  { pattern: /gift card|wire transfer|western union|money order|crypto(currency)?|bitcoin/i, label: "Untraceable payment request", weight: 25 },
  { pattern: /free (iphone|ipad|gift|money|vacation)/i, label: "Free item offer", weight: 15 },

  // Personal / credential harvesting
  { pattern: /social security|ssn|tax id|national insurance/i, label: "SSN/Tax ID request", weight: 25 },
  { pattern: /bank account|routing number|credit card number|cvv/i, label: "Banking detail request", weight: 25 },
  { pattern: /password|pin|security code|otp|one.time/i, label: "Credential phishing", weight: 20 },
  { pattern: /verify your (account|identity|details|information)/i, label: "Verification phishing", weight: 18 },

  // Suspicious links / attachments
  { pattern: /click (here|this link|below)|tap here|open this link/i, label: "Suspicious link CTA", weight: 12 },
  { pattern: /https?:\/\/(?!veldr\.io)[^\s]+\.(xyz|top|click|loan|work|gq|ml|tk)/i, label: "Suspicious domain", weight: 20 },

  // Impersonation
  { pattern: /irs|fbi|police|social security administration|medicare|hmrc|government/i, label: "Government impersonation", weight: 22 },
  { pattern: /your (account|subscription) (has been|will be) (suspended|cancelled|terminated)/i, label: "Account threat", weight: 18 },
  { pattern: /amazon|paypal|netflix|apple support|microsoft support/i, label: "Brand impersonation", weight: 15 },

  // Emotional manipulation
  { pattern: /do not (tell|share|discuss) (anyone|this|with)/i, label: "Secrecy request", weight: 20 },
  { pattern: /grandma|grandpa|it's me|in trouble|arrested|hospital|accident/i, label: "Grandparent scam pattern", weight: 22 },
]

// ─── Scoring Engine ───────────────────────────────────────────────────────────

/**
 * Analyses a message and returns a transparent ScamResult.
 * All logic is deterministic and fully explainable — no black-box ML.
 * Replace or augment with a real ML endpoint when the backend is ready.
 *
 * @param message - Raw text to analyse
 */
function detectScam(message: string): ScamResult {
  const text = message.trim()
  const matched: DetectionRule[] = []

  for (const rule of DETECTION_RULES) {
    if (rule.pattern.test(text)) {
      matched.push(rule)
    }
  }

  // Raw score capped at 100
  const rawScore = matched.reduce((sum, r) => sum + r.weight, 0)
  const score = Math.min(100, rawScore)

  const riskLevel: RiskLevel =
    score >= 55 ? "High" : score >= 25 ? "Medium" : "Low"

  const flaggedPatterns = matched.map((r) => r.label)

  // ── Explanation ────────────────────────────────────────────────────────────
  const explanationMap: Record<RiskLevel, string> = {
    High:
      "This message contains multiple strong indicators commonly associated with fraud, including requests for personal information, untraceable payments, or government impersonation.",
    Medium:
      "This message contains some characteristics of scam content. Exercise caution before responding, clicking links, or sharing any information.",
    Low:
      "No significant scam indicators were detected. The message appears relatively safe, but always use your judgement.",
  }

  // ── Suggestions ────────────────────────────────────────────────────────────
  const suggestions: string[] = []

  if (riskLevel === "High" || riskLevel === "Medium") {
    suggestions.push("Do not click any links or attachments in this message.")
    suggestions.push("Do not share personal, financial, or login information with the sender.")
  }
  if (matched.some((r) => r.label.includes("payment") || r.label.includes("Banking"))) {
    suggestions.push("Contact your bank directly if you believe your account may be at risk.")
  }
  if (matched.some((r) => r.label.includes("Government"))) {
    suggestions.push("Government agencies never request payments via gift cards or wire transfer.")
  }
  if (matched.some((r) => r.label.includes("Grandparent"))) {
    suggestions.push("Call the family member directly on a known number to verify the situation.")
  }
  if (riskLevel === "Low") {
    suggestions.push("If anything feels off, verify the sender through an official channel before responding.")
  }

  return {
    riskLevel,
    score,
    explanation: explanationMap[riskLevel],
    suggestions,
    flaggedPatterns,
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message: unknown = body?.message

    // Input validation — no hallucination on empty/invalid input
    if (typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "A message of at least 5 characters is required." },
        { status: 400 }
      )
    }

    if (message.length > 10_000) {
      return NextResponse.json(
        { error: "Message exceeds the 10,000 character limit." },
        { status: 400 }
      )
    }

    const result = detectScam(message)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("[/api/scam-check] error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
