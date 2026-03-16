"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, Loader2, Paperclip, X, ShieldAlert, Info } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "Low" | "Medium" | "High"

interface ScamResult {
  riskLevel: RiskLevel
  score: number          // 0–100
  explanation: string
  suggestions: string[]
  flaggedPatterns: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calls POST /api/scam-check with the message text.
 * Structured so the fetch URL can be swapped for a real backend endpoint
 * without touching the component logic.
 */
async function analyzeMessage(message: string): Promise<ScamResult> {
  const response = await fetch("/api/scam-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`)
  }

  return response.json() as Promise<ScamResult>
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const riskConfig: Record<RiskLevel, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  Low: {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
  },
  Medium: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  },
  High: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
  },
}

const riskBadgeVariant: Record<RiskLevel, "secondary" | "outline" | "destructive"> = {
  Low: "secondary",
  Medium: "outline",
  High: "destructive",
}

function RiskMeter({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score))
  const color = pct < 35 ? "bg-green-500" : pct < 65 ? "bg-amber-500" : "bg-red-500"

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Scam likelihood</span>
        <span className="font-medium tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ResultCard({ result }: { result: ScamResult }) {
  const cfg = riskConfig[result.riskLevel]

  return (
    <div className={`rounded-lg border p-5 space-y-4 ${cfg.bg} ${cfg.border}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {cfg.icon}
          <div>
            <p className={`font-semibold text-sm ${cfg.color}`}>
              {result.riskLevel === "High"
                ? "High Risk — Likely a Scam"
                : result.riskLevel === "Medium"
                ? "Moderate Risk — Proceed with Caution"
                : "Low Risk — Appears Safe"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {result.explanation}
            </p>
          </div>
        </div>
        <Badge variant={riskBadgeVariant[result.riskLevel]} className="flex-shrink-0">
          {result.riskLevel}
        </Badge>
      </div>

      {/* Meter */}
      <RiskMeter score={result.score} />

      {/* Flagged patterns */}
      {result.flaggedPatterns.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Detected patterns</p>
          <div className="flex flex-wrap gap-2">
            {result.flaggedPatterns.map((p) => (
              <span
                key={p}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-background border border-border text-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Recommendations</p>
          <ul className="space-y-1">
            {result.suggestions.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm">
                <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScamChecker() {
  const [message, setMessage] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScamResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSubmit = message.trim().length > 10 && !isLoading

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setMessage(text || "")
    }
    reader.readAsText(file)
  }

  const clearFile = () => {
    setFileName(null)
    setMessage("")
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await analyzeMessage(message.trim())
      setResult(data)
    } catch (err) {
      setError("Analysis could not be completed. Please try again.")
      console.error("[ScamChecker] analysis error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessage("")
    setFileName(null)
    setResult(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-xl">Test a Suspicious Message</CardTitle>
        </div>
        <CardDescription>
          Paste or upload a message you have received and our system will analyse it to
          determine whether it may be a scam.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text input */}
          <div className="space-y-1.5">
            <Textarea
              placeholder="Paste the message text here…  e.g. &quot;You have won a $1,000 gift card. Click here to claim…&quot;"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none text-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length} characters
            </p>
          </div>

          {/* File upload */}
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.csv,.eml,image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            {fileName ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted text-sm">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate max-w-[200px]">{fileName}</span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4 mr-1.5" />
                Upload file
              </Button>
            )}
            <span className="text-xs text-muted-foreground">.txt, .eml, or image</span>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className="btn-veldr-primary"
              disabled={!canSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysing…
                </>
              ) : (
                "Analyse Message"
              )}
            </Button>
            {(result || error) && (
              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                Start over
              </Button>
            )}
          </div>
        </form>

        {/* Error state */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-2 bg-muted rounded" />
            <div className="h-2 bg-muted rounded w-4/5" />
          </div>
        )}

        {/* Result */}
        {result && !isLoading && <ResultCard result={result} />}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground pt-1 border-t">
          Results are for guidance only. When in doubt, do not respond to, click links in,
          or share personal information with the sender.
        </p>
      </CardContent>
    </Card>
  )
}
