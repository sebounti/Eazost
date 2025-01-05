"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      setIsOpen(true)
    } else {
      setPreferences(JSON.parse(consent))
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    }
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted))
    setPreferences(allAccepted)
    setIsOpen(false)
  }

  const savePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences))
    setIsOpen(false)
  }

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Paramètres des cookies</DialogTitle>
          <DialogDescription>
            Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic de notre site. Vous pouvez choisir les cookies que vous acceptez.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="essential" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Cookies essentiels
              </label>
              <p className="text-sm text-muted-foreground">Toujours actifs</p>
            </div>
            <Switch
              id="essential"
              checked={preferences.essential}
              onCheckedChange={() => {}}
              disabled
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="analytics" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Cookies d'analyse
              </label>
              <p className="text-sm text-muted-foreground">Nous aident à améliorer le site</p>
            </div>
            <Switch
              id="analytics"
              checked={preferences.analytics}
              onCheckedChange={() => handleToggle('analytics')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Cookies marketing
              </label>
              <p className="text-sm text-muted-foreground">Utilisés pour la publicité ciblée</p>
            </div>
            <Switch
              id="marketing"
              checked={preferences.marketing}
              onCheckedChange={() => handleToggle('marketing')}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={savePreferences}>
            Enregistrer les préférences
          </Button>
          <Button type="button" onClick={acceptAll}>
            Tout accepter
          </Button>
        </DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
