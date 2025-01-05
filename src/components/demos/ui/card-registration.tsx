'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../app/globals.css'; // Chemin relatif depuis src/components/demos/ vers src/styles/
import { z } from 'zod';
import CustomTooltip from "@/components/CustomTooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usersSchema } from '@/validation/UserSchema';


// Import des composants UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterCard() {
  const router = useRouter();

  const [formdata, setFormdata] = useState({
    user_name: '',
    email: '',
    password: '',
    account_type: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormdata({
      ...formdata,
      [id]: value,
    });
    // Effacer l'erreur du champ modifié
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: '',
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormdata({
      ...formdata,
      account_type: value,
    });
    // Effacer l'erreur du champ sélectionné
    if (formErrors['account_type']) {
      setFormErrors({
        ...formErrors,
        account_type: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setFormErrors({});

    try {
      // Validation côté client
      usersSchema.parse(formdata);

      const response = await fetch('/api/connexion/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.validationErrors) {
          const errors: { [key: string]: string } = {};
          result.validationErrors.forEach((error: { field: string, message: string }) => {
            errors[error.field] = error.message;
          });
          setFormErrors(errors);
        } else {
          setError(result.error || 'An error occurred while creating your account.');
        }
      } else {
        setSuccess(true);
        // Réinitialiser le formulaire
        setFormdata({
          user_name: '',
          email: '',
          password: '',
          account_type: '',
        });
		// Effacer les erreurs
        setFormErrors({});
		// Rediriger vers la page appropriée après 3 secondes
		setTimeout(() => {
			router.push('/login'); // Redirection après l'envoi du mail
		  }, 3000);
		alert('Account created successfully. Please check your email to verify your account.');
		}
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        err.errors.forEach((e) => {
          errors[e.path[0]] = e.message;
        });
        setFormErrors(errors);
      } else {
        console.error('Erreur lors de la soumission du formulaire :', err);
        setError('Une erreur est survenue lors de la création de votre compte.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
	<TooltipProvider>
    <Card className="h-[480px] w-96 shadow-md rounded-lg p-6 bg-white text-[#123B4D]">
      <CardHeader>
        <CardTitle className="text-xxl flex justify-center font-bold">Welcome !</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            {/* Champ Nom d'utilisateur */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user_name">User name</Label>

			  <CustomTooltip message={formErrors.user_name} className={formErrors.user_name ? 'form-error' : ''}>

			  <Input
                id="user_name"
                type="text"
                placeholder="Enter your username"
                value={formdata.user_name}
                onChange={handleChange}
				className={`input ${formErrors.user_name ? 'border-red-500 bg-red-50' : ''}`}
              />

			</CustomTooltip>
            </div>

            {/* Champ Email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
			  <CustomTooltip message={formErrors.email} className={formErrors.email ? 'form-error' : ''}>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formdata.email}
                onChange={handleChange}
				className={`input ${formErrors.email ? 'border-red-500 bg-red-50' : ''}`}
              />
			  </CustomTooltip>
            </div>

            {/* Champ Mot de passe */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
			  <CustomTooltip message={formErrors.password} className={formErrors.password ? 'form-error' : ''}>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formdata.password}
                onChange={handleChange}
				className={`input ${formErrors.password ? 'border-red-500 bg-red-50' : ''}`}
              />
            </CustomTooltip>
            </div>

            {/* Champ Type de compte */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="account_type">Account Type</Label>
              <Select onValueChange={handleSelectChange}value={formdata.account_type}>
                <SelectTrigger id="account_type" className="bg-[#F8FAFC]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-[#F8FAFC]">
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.account_type && (
                <p className="text-red-500">{formErrors.account_type}</p>
              )}
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="mt-4 bg-[#FF7A00] w-full text-white py-2 px-4 rounded-xl hover:bg-[#e76600]"
            >
              {loading ? 'Creation in progress...' : 'Create your account'}
            </Button>
          </div>
        </form>

      </CardContent>
    </Card>
	</TooltipProvider>

  );
}
