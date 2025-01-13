"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAccommodationStore } from "@/stores/accommodationStore";
import { useAuthStore } from "@/stores/authStore";
import { useSession } from "next-auth/react";
import { ShadcnDatePicker } from "@/components/ui/date-picker";


type AccessCodeFormProps = {
  onSubmit: (data: any) => void;
};

const AccessCodeForm = ({ onSubmit }: AccessCodeFormProps) => {
  const { data: session } = useSession();
  const { user } = useAuthStore();
  const { accommodationInfo, fetchAccommodationInfo } = useAccommodationStore();
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");

  // Mémorisation de fetchAccommodationInfo
  const fetchInfo = useCallback(() => {
    if (session?.user) {
      fetchAccommodationInfo(session.user.id);
    }
  }, [session?.user, fetchAccommodationInfo]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const accommodations = Array.isArray(accommodationInfo) ? accommodationInfo : [];
  console.log("Processed accommodations:", accommodations);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccommodation || (!email && !phone)) {
      return alert("Veuillez remplir tous les champs.");
    }
    const contact = contactMethod === "email" ? email : phone;
    onSubmit({ accommodation: selectedAccommodation, contactMethod, contact });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sélection du logement */}
      <div>
        <Label className="text-sm font-bold">Logement</Label>
        <select
          value={selectedAccommodation || ''}
          onChange={(e) => setSelectedAccommodation(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-amber-500"
        >
          <option value="" disabled>Sélectionnez un logement</option>
          {accommodations.length > 0 ? (
            accommodations.map((acc) => (
              <option
                key={acc.accommodation_id}
                value={acc.accommodation_id.toString()}
              >
                {acc.name}
              </option>
            ))
          ) : (
            <option value="no-accommodations" disabled>
              Aucun logement disponible
            </option>
          )}
        </select>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col justify-center">
              <label htmlFor="startDate" className="text-sm font-bold">Date de début</label>
              <ShadcnDatePicker
                startYear={2025}
                endYear={2050}
                onSelect={(date) => console.log(date)}
              />
            </div>
            <div className="flex flex-col justify-center my-2">
              <label htmlFor="endDate" className="text-sm font-bold">Date de fin</label>
              <ShadcnDatePicker
                startYear={2025}
                endYear={2050}
                onSelect={(date) => console.log(date)}
              />
            </div>
          </div>
        </div>

	{/* Méthode de contact */}
       <Label className="text-sm font-bold">Contact</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="email"
              name="contactMethod"
              value="email"
              checked={contactMethod === "email"}
              onChange={() => setContactMethod("email")}
            />
            <Label htmlFor="email">Email</Label>
          </div>
          <Input
            type="email"
            placeholder="client@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={contactMethod !== "email"}
          />

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="phone"
              name="contactMethod"
              value="phone"
              checked={contactMethod === "phone"}
              onChange={() => setContactMethod("phone")}
            />
            <Label htmlFor="phone">Téléphone</Label>
          </div>
          <Input
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={contactMethod !== "phone"}
          />
        </div>

      {/* Bouton de soumission */}
      <Button type="submit" className="w-full bg-amber-500 text-white rounded-lg p-2">
        Générer
      </Button>
    </form>
  );
};

export default AccessCodeForm;
