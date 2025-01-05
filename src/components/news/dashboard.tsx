"use client"

import { useState } from 'react'
import { Bell, Home, MessageSquare, Package, Settings, ShieldCheck, CreditCard, TrendingUp, Users, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

// Supposons que ces données viennent de votre base de données
const properties = [
  {
    id: 1,
    name: "Appartement Paris",
    unreadMessages: 3,
    pendingOrders: 2,
    totalSales: 1500,
    occupancyRate: 85,
    upcomingBookings: 5,
    averageRating: 4.7
  },
  {
    id: 2,
    name: "Villa Côte d'Azur",
    unreadMessages: 1,
    pendingOrders: 0,
    totalSales: 2800,
    occupancyRate: 92,
    upcomingBookings: 8,
    averageRating: 4.9
  },
  {
    id: 3,
    name: "Chalet Alpes",
    unreadMessages: 0,
    pendingOrders: 1,
    totalSales: 950,
    occupancyRate: 78,
    upcomingBookings: 3,
    averageRating: 4.5
  },
]

export default function Dashboard() {
  const [selectedProperty, setSelectedProperty] = useState(properties[0])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard du Propriétaire</h1>

      <div className="mb-6">
        <Select onValueChange={(value) => setSelectedProperty(properties.find(p => p.id.toString() === value) || properties[0])}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Sélectionnez un logement" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id.toString()}>{property.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProperty.totalSales} €</div>
            <p className="text-xs text-muted-foreground">
              +20% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProperty.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Pour les 30 derniers jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations à venir</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProperty.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Dans les 30 prochains jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestion du Shop</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProperty.pendingOrders} commandes en attente</div>
            <p className="text-xs text-muted-foreground">
              {selectedProperty.pendingOrders === 0 ? "Aucune action requise" : "Action requise"}
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href={`/property/${selectedProperty.id}/shop`}>Gérer le shop</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Codes d'accès</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 codes actifs</div>
            <p className="text-xs text-muted-foreground">2 expirent bientôt</p>
            <Button asChild className="mt-4 w-full">
              <Link href={`/property/${selectedProperty.id}/access-codes`}>Gérer les codes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messagerie</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProperty.unreadMessages} messages non lus</div>
            <p className="text-xs text-muted-foreground">
              {selectedProperty.unreadMessages === 0 ? "Vous êtes à jour" : "Nouveaux messages"}
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href={`/property/${selectedProperty.id}/messages`}>Voir les messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Informations du logement</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">Gérez les détails de votre propriété</p>
            <Button asChild className="mt-4 w-full">
              <Link href={`/property/${selectedProperty.id}/info`}>Modifier les infos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes d'information</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">Créez des cartes personnalisées</p>
            <Button asChild className="mt-4 w-full">
              <Link href={`/property/${selectedProperty.id}/info-cards`}>Gérer les cartes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paramètres</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">Configurez votre compte et vos préférences</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/settings">Paramètres</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notifications récentes</CardTitle>
          <CardDescription>Vos 5 dernières notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              <span>Nouvelle réservation pour {selectedProperty.name}</span>
            </li>
            <li className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              <span>Message de locataire pour {selectedProperty.name}</span>
            </li>
            <li className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              <span>Commande en attente dans le shop de {selectedProperty.name}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
