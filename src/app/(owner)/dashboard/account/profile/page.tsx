"use client";
import React from 'react'; // Import the 'React' library
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import UserInfoForm from "@/components/UserInfoForm"

/**
 * Profil page.
 *
 * Cette page affiche les infos de chaque proprieter.
 */

export default function ProfilePage() {
  return (
    <>
      <header className="flex items-center gap-4 p-4">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-xl hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="text-lg">
                <BreadcrumbPage>Profil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="container p-4 mx-auto">
        <h1 className="mb-4 text-4xl font-krona font-bold">Profil</h1>
        <h2 className="mb-6 pb-4 text-2xl text-gray-600">Gérer ici les informations de votre profil.</h2>

        <UserInfoForm />

        <Card className="my-6">
          <CardHeader>
            <CardTitle>Coordonnées professionnelles</CardTitle>
            <CardDescription className="text-lg">Informations relatives à votre activité professionnelle.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Ici vous pouvez ajouter un formulaire pour les informations professionnelles */}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription className="text-lg">Gérez vos documents personnels et professionnels.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Ici vous pouvez ajouter une section pour la gestion des documents */}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
