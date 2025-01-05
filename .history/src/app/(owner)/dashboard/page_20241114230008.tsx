"use client"

import { useState } from 'react'
import { Bell, Home, MessageSquare, Package, Settings, ShieldCheck, CreditCard, TrendingUp, Users, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'


export default function Dashboard() {
	

  return (
    <div className="container p-4 mx-auto">
      <div className="grid gap-6 mt-6 md:grid-cols-2 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Ventes Totales</CardTitle>
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-2xl font-bold">{selectedProperty.totalSales} €</div>
            <p className="text-md text-muted-foreground">
              +20% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

		<Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Gestion du Shop</CardTitle>
            <Package className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-2xl font-bold">{selectedProperty.pendingOrders} commandes en attente</div>
            <p className="text-md text-muted-foreground">
              {selectedProperty.pendingOrders === 0 ? "Aucune action requise" : "Action requise"}
            </p>
            <Button asChild className="mt-4 shadow-lg text-md bg-amber-400 rounded-xl">
              <Link href={`/property/${selectedProperty.id}/shop`}>Gérer le shop</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Réservations à venir</CardTitle>
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-2xl font-bold">{selectedProperty.upcomingBookings}</div>
            <p className="text-md text-muted-foreground">
              Dans les 30 prochains jours
            </p>
          </CardContent>
        </Card>



        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Codes d&apos;accès</CardTitle>
            <ShieldCheck className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-2xl font-bold ">5 codes actifs</div>
            <p className="text-md text-muted-foreground">2 expirent bientôt</p>
            <Button asChild className="mt-4 shadow-lg text-md bg-amber-400 rounded-xl">
              <Link href={`/property/${selectedProperty.id}/access-codes`}>Gérer les codes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Messagerie</CardTitle>
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-2xl font-bold">{selectedProperty.unreadMessages} messages non lus</div>
            <p className="text-md text-muted-foreground">
              {selectedProperty.unreadMessages === 0 ? "Vous êtes à jour" : "Nouveaux messages"}
            </p>
            <Button asChild className="mt-4 shadow-lg text-md bg-amber-400 rounded-xl">
              <Link href={`/property/${selectedProperty.id}/messages`}>Voir les messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Informations du logement</CardTitle>
            <Home className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent >
            <p className="mb-10 text-md">Gérez les détails de votre propriété</p>
            <Button asChild className="mt-4 shadow-lg text-md text-end bg-amber-400 rounded-xl">
              <Link href={`/property/${selectedProperty.id}/info`}>Modifier les infos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Cartes d&apos;information</CardTitle>
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mb-10 text-md">Créez des cartes personnalisées</p>
            <Button asChild className="mt-4 shadow-lg text-md bg-amber-400 rounded-xl">
              <Link href={`/property/${selectedProperty.id}/info-cards`}>Gérer les cartes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Paramètres</CardTitle>
            <Settings className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mb-10 text-md">Configurez votre compte et vos préférences</p>
            <Button asChild className="mt-4 shadow-lg text-md bg-amber-400 rounded-xl">
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
              <Bell className="w-6 h-6 mr-2" />
              <span>Nouvelle réservation pour {selectedProperty.name}</span>
            </li>
            <li className="flex items-center">
              <Bell className="w-6 h-6 mr-2" />
              <span>Message de locataire pour {selectedProperty.name}</span>
            </li>
            <li className="flex items-center">
              <Bell className="w-6 h-6 mr-2" />
              <span>Commande en attente dans le shop de {selectedProperty.name}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
