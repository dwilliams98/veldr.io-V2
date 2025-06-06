"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, Info, CheckCircle } from "lucide-react"
import { APP_VERSION, APP_BUILD_DATE, APP_RELEASE_NAME } from "@/config/version"

export function VersionBadge() {
  return (
    <Badge variant="outline" className="text-xs">
      v{APP_VERSION}
    </Badge>
  )
}

export function VersionInfo() {
  const [open, setOpen] = useState(false)
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<"checking" | "up-to-date" | "update-available" | null>(null)

  const checkForUpdates = async () => {
    setCheckingUpdates(true)
    setUpdateStatus("checking")

    // Simulate checking for updates
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setUpdateStatus("up-to-date")
    setCheckingUpdates(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Info className="h-4 w-4" />
          <span className="text-xs">v{APP_VERSION}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Veldr.io Version Information
          </DialogTitle>
          <DialogDescription>Details about your current version and update status</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Version</div>
            <div className="font-medium">
              {APP_VERSION} ({APP_RELEASE_NAME})
            </div>

            <div className="text-muted-foreground">Build Date</div>
            <div className="font-medium">{APP_BUILD_DATE}</div>

            <div className="text-muted-foreground">Status</div>
            <div className="font-medium flex items-center gap-1.5">
              <Badge variant="success" className="bg-green-500 text-white">
                Latest
              </Badge>
              <span>Up to date</span>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-start gap-2">
              {updateStatus === "up-to-date" ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {updateStatus === "checking"
                    ? "Checking for updates..."
                    : updateStatus === "up-to-date"
                      ? "You're on the latest version"
                      : "Veldr.io v16 - Sentinel"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {updateStatus === "checking"
                    ? "Please wait while we check for updates"
                    : updateStatus === "up-to-date"
                      ? "No updates available at this time"
                      : "This version includes the latest security features and performance improvements"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={checkForUpdates} disabled={checkingUpdates || updateStatus === "up-to-date"}>
              {checkingUpdates ? "Checking..." : "Check for Updates"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
