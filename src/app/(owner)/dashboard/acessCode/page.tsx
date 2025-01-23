"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import AccessCodeDialog from "@/components/card/dialogs/AccessCodeDialog";

interface AccessCode {
  id: string;
  code: string;
  logement: string;
  dateCreation: Date;
  dateExpiration: Date;
  status: string;
}

export default function AccessCodePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });
  const [filterLogement, setFilterLogement] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDateStart, setFilterDateStart] = useState<Date>();
  const [filterDateEnd, setFilterDateEnd] = useState<Date>();
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleGenerateCode = (data: any) => {
    console.log("Code généré :", data);
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
	<SidebarTrigger className="text-md" />
	<Separator orientation="vertical" className="mr-2 h-4" />
	<Breadcrumb>
	  <BreadcrumbList>
		<BreadcrumbItem>
		  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
		  <BreadcrumbLink className="text-xl text-amber-500">Code d'accès</BreadcrumbLink>
		</BreadcrumbItem>
	  </BreadcrumbList>
	</Breadcrumb>
  </div>


    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des codes d'accès</h1>
        <p className="mt-2 text-gray-600">
          Créez et gérez les codes d'accès pour vos logements
        </p>
      </div>

	<div className="flex justify-start mb-4">
      {/* Bouton qui ouvre la modale */}
      <AccessCodeDialog onSubmit={handleGenerateCode}>
        <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
          + Créer un code d'accès
        </button>
      </AccessCodeDialog>
	</div>

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
          endYear={2050}
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
