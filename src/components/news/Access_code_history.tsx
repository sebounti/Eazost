"use client"

import { useState } from "react"
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns"
import { MoreHorizontal, Trash, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for demonstration
const initialCodes = [
  { id: 1, createdAt: new Date("2023-05-01"), accommodation: "Appartement 1", status: "Actif", code: "ABC123", expiresAt: new Date("2023-07-01") },
  { id: 2, createdAt: new Date("2023-05-15"), accommodation: "Maison 1", status: "Expiré", code: "DEF456", expiresAt: new Date("2023-06-15") },
  { id: 3, createdAt: new Date("2023-06-01"), accommodation: "Villa 1", status: "Actif", code: "GHI789", expiresAt: new Date("2023-08-01") },
]

export default function AccessCodeHistory() {
  const [codes, setCodes] = useState(initialCodes)
  const [selectedCode, setSelectedCode] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const removeCode = (id: number) => {
    setCodes(codes.filter(code => code.id !== id))
  }

  const viewCodeDetails = (code: any) => {
    setSelectedCode(code)
    setIsDialogOpen(true)
  }

  const getRemainingTime = (expiresAt: Date) => {
    const now = new Date()
    if (now > expiresAt) return "Expiré"

    const days = differenceInDays(expiresAt, now)
    const hours = differenceInHours(expiresAt, now) % 24
    const minutes = differenceInMinutes(expiresAt, now) % 60

    if (days > 0) return `${days}j ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Historique des Codes d'Accès</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date de Création</TableHead>
            <TableHead>Logement</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Temps Restant</TableHead>
            <TableHead className="text-right">Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.map((code) => (
            <TableRow key={code.id}>
              <TableCell>{format(code.createdAt, "dd/MM/yyyy")}</TableCell>
              <TableCell>{code.accommodation}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  code.status === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {code.status}
                </span>
              </TableCell>
              <TableCell>{getRemainingTime(code.expiresAt)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => viewCodeDetails(code)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Voir les détails</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => removeCode(code.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du Code d'Accès</DialogTitle>
            <DialogDescription>
              {selectedCode && (
                <div className="mt-2">
                  <p><strong>Code:</strong> {selectedCode.code}</p>
                  <p><strong>Date de création:</strong> {format(selectedCode.createdAt, "dd/MM/yyyy")}</p>
                  <p><strong>Logement:</strong> {selectedCode.accommodation}</p>
                  <p><strong>Statut:</strong> {selectedCode.status}</p>
                  <p><strong>Expire le:</strong> {format(selectedCode.expiresAt, "dd/MM/yyyy")}</p>
                  <p><strong>Temps restant:</strong> {getRemainingTime(selectedCode.expiresAt)}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
