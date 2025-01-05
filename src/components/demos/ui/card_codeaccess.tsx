'use client';

import { useState } from "react";
import emailjs from 'emailjs-com';
import bcrypt from 'bcryptjs';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import crypto from 'crypto';

export default function Card_Codeaccess() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  // Fonction pour générer un code sécurisé avec `crypto`
  function generateSecureCode(length = 12): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Fonction pour hacher le code avec `bcrypt`
  async function hashCode(code: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(code, salt);
  }

  // Fonction pour ouvrir le modal
  function openModal() {
    setIsModalOpen(true);
  }

  // Fonction pour fermer le modal
  function closeModal() {
    setIsModalOpen(false);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);
  }

  // Fonction pour envoyer l'email avec le code sécurisé
  async function sendEmail(): Promise<void> {
    const code = generateSecureCode(); // Génère le code sécurisé
    const hashedCode = await hashCode(code); // Hash le code

    const templateParams = {
      user_email: email, // L'email de l'utilisateur
      verification_code: code, // Envoie le code (pas haché pour l'email)
    };

    // Envoi de l'email avec emailjs configuration de l'API
    emailjs
      .send(
        'service_pzcl27p', // Service ID
        'template_at9hmie', // Template ID
        templateParams,
        'wn8q2LPbRfvR4SZ2x' // User ID
      )
      .then(
        (result) => {
          console.log('Email envoyé avec succès:', result.text);
          closeModal(); // Ferme le modal après l'envoi
        },
        (error) => {
          console.log('Erreur lors de l\'envoi de l\'email:', error.text);
        }
      );
  }

  return (
    <div>
      <Card className="h-[250px] w-[650px] shadow-md rounded-xl p-6 bg-white text-[#123B4D]">
        <CardHeader>
          <CardTitle className="text-xl flex font-bold">Select your property</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="w-[300px] justify-center items-center rounded-xl">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="Account Type"></Label>
                <Select>
                  <SelectTrigger id="account type" className="bg-[#F8FAFC]">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-[#F8FAFC]">
                    <SelectItem value="proprietaire">Home 1</SelectItem>
                    <SelectItem value="users">Home 2</SelectItem>
                  </SelectContent>
                </Select>
				<Select>
                  <SelectTrigger id="account type" className="bg-[#F8FAFC]">
                    <SelectValue placeholder="Select " />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-[#F8FAFC]">
                    <SelectItem value="One Week">One Week</SelectItem>
                    <SelectItem value="two Week">wo Week</SelectItem>
					<SelectItem value="three Week">Three Week</SelectItem>

                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="my-4 flex overflow-hidden">
          <Button
            className="bg-[#FF7A00] w-50 text-white py-2 px-4 rounded-xl hover:bg-[#e76600]"
            onClick={openModal}
          >
            Generate Code Access
          </Button>
        </CardFooter>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-[500px] h-[160px] bg-white p-4 rounded-xl shadow-lg ">
            <h2 className="text-xl font-bold mb-4">Envoyer par email</h2>

            {/* Champ email */}
            <label className="block text-sm font-bold mb-4" htmlFor="email">
              <input
                className="border border-gray-300 rounded-xl p-2 w-full"
                type="email"
                id="email"
                name="to_email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
              />
            </label>

            {/* Boutons */}
            <div className="flex justify-center mt-4 pr-3">
              <button
                className="bg-[#FF7A00] text-white py-2 px-4 mr-4 rounded-xl hover:bg-[#e76600]"
                onClick={closeModal}
              >
                Fermer
              </button>
              <button
                className="bg-[#FF7A00] text-white py-2 px-4 ml-4 rounded-xl hover:bg-[#e76600]"
                onClick={sendEmail}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
