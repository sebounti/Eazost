"use client"

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Component({
  inactivityTime = 5 * 60 * 1000, // 5 minutes par défaut
  warningTime = 1 * 60 * 1000, // 1 minute d'avertissement par défaut
  onLogout = () => console.log("Déconnexion") // Fonction de déconnexion par défaut
}) {
  const [showWarning, setShowWarning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(warningTime)

  const resetTimer = useCallback(() => {
    setShowWarning(false)
    setRemainingTime(warningTime)
  }, [warningTime])

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    let warningTimer: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer)
      clearTimeout(warningTimer)
      clearInterval(countdownInterval)
      resetTimer()

      inactivityTimer = setTimeout(() => {
        setShowWarning(true)
        warningTimer = setTimeout(onLogout, warningTime)
        countdownInterval = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1000) {
              clearInterval(countdownInterval)
              return 0
            }
            return prevTime - 1000
          })
        }, 1000)
      }, inactivityTime)
    }

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(event => document.addEventListener(event, resetInactivityTimer))

    resetInactivityTimer()

    return () => {
      events.forEach(event => document.removeEventListener(event, resetInactivityTimer))
      clearTimeout(inactivityTimer)
      clearTimeout(warningTimer)
      clearInterval(countdownInterval)
    }
  }, [inactivityTime, warningTime, onLogout, resetTimer])

  const handleStayLoggedIn = () => {
    resetTimer()
  }

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vous allez être déconnecté</DialogTitle>
        </DialogHeader>
        <p>
          Vous serez automatiquement déconnecté dans{' '}
          {Math.ceil(remainingTime / 1000)} secondes en raison d'inactivité.
        </p>
        <DialogFooter>
          <Button onClick={handleStayLoggedIn}>Rester connecté</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
