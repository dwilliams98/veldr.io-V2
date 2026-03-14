"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface VeldrLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon" | "text"
  className?: string
  showTagline?: boolean
}

const logoSizes = {
  sm: { width: 80, height: 28 },
  md: { width: 110, height: 38 },
  lg: { width: 140, height: 48 },
  xl: { width: 180, height: 62 },
}

const textSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
}

export function VeldrLogo({ size = "md", variant = "full", className, showTagline = false }: VeldrLogoProps) {
  const dimensions = logoSizes[size]

  if (variant === "full") {
    return (
      <div className={cn("flex items-center", className)}>
        <Image
          src="/veldr-logo.png"
          alt="Veldr.io - AI Protection for Elders"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain"
          priority
        />
        {showTagline && (
          <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
            AI Protection for the Ones Who Raised Us
          </span>
        )}
      </div>
    )
  }

  if (variant === "icon") {
    return (
      <div className={cn("w-8 h-8 rounded-md bg-primary flex items-center justify-center", className)}>
        <span className="text-white font-bold text-sm">V</span>
      </div>
    )
  }

  return (
    <span className={cn("font-bold text-primary", textSizes[size], className)}>
      Veldr.io
    </span>
  )
}

export default VeldrLogo
