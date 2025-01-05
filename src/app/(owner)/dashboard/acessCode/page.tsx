"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShadcnDatePicker } from "@/components/ui/date-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AccessCode {
  id: string;
  code: string;
  logement: string;
  dateCreation: Date;
  dateExpiration: Date;
  status: "actif" | "expiré" | "inactif";
}

export default function AccessCodePage() {
  const [code, setCode] = useState("");
  const [filterLogement, setFilterLogement] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDateStart, setFilterDateStart] = useState<Date>();
  const [filterDateEnd, setFilterDateEnd] = useState<Date>();

  // Exemple de données (à remplacer par vos données réelles)
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([
    {
      id: "1",
      code: "123456",
      logement: "Appartement A",
      dateCreation: new Date(),
      dateExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "actif",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Logique pour sauvegarder le code d'accès
      toast.success("Code d'accès mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du code d'accès");
    }
  };

  const filteredCodes = accessCodes.filter((accessCode) => {
    const matchLogement = !filterLogement || accessCode.logement === filterLogement;
    const matchStatus = !filterStatus || accessCode.status === filterStatus;
    const matchDateRange =
      (!filterDateStart || accessCode.dateCreation >= filterDateStart) &&
      (!filterDateEnd || accessCode.dateExpiration <= filterDateEnd);
    return matchLogement && matchStatus && matchDateRange;
  });

  return (
	<><div className="flex items-center gap-4 p-4">
	<SidebarTrigger className="text-xl" />
	<Separator orientation="vertical" className="mr-2 h-4" />
	<Breadcrumb>
	  <BreadcrumbList>
		<BreadcrumbItem>
		  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
		  <BreadcrumbLink className="text-xl">Boutique</BreadcrumbLink>
		</BreadcrumbItem>
	  </BreadcrumbList>
	</Breadcrumb>
  </div>


    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des codes d'accès</h1>
        <p className="mt-2 text-gray-600">
          Créez et gérez les codes d'accès temporaires pour vos logements
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mb-8">
        <div>
          <label htmlFor="accessCode" className="block text-sm font-medium mb-2">
            Nouveau code d'accès
          </label>
          <Input
            id="accessCode"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Entrez le nouveau code d'accès"
            className="w-full"
          />
        </div>

        <Button type="submit">
          Mettre à jour le code
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Select onValueChange={setFilterLogement}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par logement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Appartement A">Appartement A</SelectItem>
            <SelectItem value="Appartement B">Appartement B</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="expiré">Expiré</SelectItem>
            <SelectItem value="inactif">Inactif</SelectItem>
          </SelectContent>
        </Select>

        <ShadcnDatePicker
          placeholder="Date début"
          selected={filterDateStart}
          onSelect={setFilterDateStart}
          startYear={2024}
          endYear={2030}
        />

        <ShadcnDatePicker
          placeholder="Date fin"
          selected={filterDateEnd}
          onSelect={setFilterDateEnd}
		  startYear={2024}
		  endYear={2030}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Logement</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Date d'expiration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCodes.map((accessCode) => (
              <TableRow key={accessCode.id}>
                <TableCell>{accessCode.code}</TableCell>
                <TableCell>{accessCode.logement}</TableCell>
                <TableCell>
                  {accessCode.dateCreation.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {accessCode.dateExpiration.toLocaleDateString()}
                </TableCell>
                <TableCell>{accessCode.status}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Logique pour supprimer/désactiver le code
                      toast.success("Code supprimé avec succès");
                    }}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
	</>
  );
}
