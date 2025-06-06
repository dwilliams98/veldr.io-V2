import Image from "next/image"

interface VeldrLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
}

export default function VeldrLogo({ className = "", size = "md", showText = true }: VeldrLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  }

  if (showText) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Image
          src="/images/veldr-logo.png"
          alt="Veldr.io - AI Protection for the ones who raised us"
          width={200}
          height={60}
          className={sizeClasses[size]}
          priority
        />
      </div>
    )
  }

  // Extract just the wave symbol portion for icon usage
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} bg-veldr-primary rounded-lg flex items-center justify-center`}>
        <svg viewBox="0 0 40 40" className="w-full h-full p-1" fill="currentColor">
          <path
            d="M8 20c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S8 26.627 8 20zm12-8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"
            className="text-white"
          />
          <path
            d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8zm8-4c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z"
            className="text-white opacity-70"
          />
          <path d="M16 20c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4z" className="text-white opacity-40" />
        </svg>
      </div>
    </div>
  )
}
