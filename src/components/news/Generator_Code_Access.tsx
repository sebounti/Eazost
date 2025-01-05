"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Simulated database
let codeDatabase: any[] = []

export default function AccessCodeGenerator() {
  const [accommodation, setAccommodation] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState("00:00")
  const [endTime, setEndTime] = useState("23:59")
  const [accessCode, setAccessCode] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [contactMethod, setContactMethod] = useState("email")

  const accommodations = [
    { id: "apt1", name: "Appartement 1" },
    { id: "apt2", name: "Appartement 2" },
    { id: "house1", name: "Maison 1" },
    { id: "villa1", name: "Villa 1" },
  ]

  const generateAndSendCode = () => {
    if (!accommodation || !startDate || !endDate || (!email && !phone)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setAccessCode(code)

    // Simulate storing in database
    const codeEntry = {
      code,
      accommodation,
      startDate: `${format(startDate, "yyyy-MM-dd")}T${startTime}`,
      endDate: `${format(endDate, "yyyy-MM-dd")}T${endTime}`,
      contactMethod,
      contact: contactMethod === "email" ? email : phone,
    }
    codeDatabase.push(codeEntry)

    // Simulate sending code
    const sendMethod = contactMethod === "email" ? "envoyé par e-mail" : "envoyé par SMS"
    toast({
      title: "Code généré et envoyé",
      description: `Le code ${code} a été ${sendMethod} et enregistré dans la base de données.`,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Générateur de Code d'Accès</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accommodation">Logement</Label>
          <Select onValueChange={setAccommodation} value={accommodation}>
            <SelectTrigger id="accommodation">
              <SelectValue placeholder="Sélectionnez un logement" />
            </SelectTrigger>
            <SelectContent>
              {accommodations.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date de début</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "P") : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date de fin</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "P") : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <Tabs value={contactMethod} onValueChange={setContactMethod}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Téléphone</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <div className="space-y-2">
              <Label htmlFor="email">Email du client</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="phone">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone du client</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button onClick={generateAndSendCode} className="w-full">
          Générer et Envoyer le Code d'Accès
        </Button>
        {accessCode && (
          <div className="w-full text-center">
            <Label>Code d'Accès Généré</Label>
            <div className="mt-2 p-2 bg-secondary text-secondary-foreground rounded-md text-2xl font-bold">
              {accessCode}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
