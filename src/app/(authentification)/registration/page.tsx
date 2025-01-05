'use client';
import '@/app/globals.css'; // Assurez-vous que le chemin est correct
import Image from "next/image";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
// Import du schéma de validation des utilisateurs
import { usersSchema } from "@/validation/UserSchema";


// Page d'inscription
export default function RegisterPage() {

	const [formdata, setFormdata] = useState({
		user_name: '',
		email: '',
		password: '',
		account_type: '',
		name: '',
		emailVerified: null,
		image: '',
		stripe_customer_id: '',
		acceptTerms: false,
	  });

	  const [formErrors, setFormErrors] = useState({
		user_name: '',
		email: '',
		password: '',
		account_type: '',
		acceptTerms: '',
		general: ''
	})

	  const [success, setSuccess] = useState(false);
	  const [loading, setLoading] = useState(false);
	  const [showPassword, setShowPassword] = useState(false);
	  const [open, setOpen] = useState(false);

	  const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	  }

	  // Gestion des données du formulaire
	  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { id, value, type, checked } = e.target as HTMLInputElement;

		console.log("Changement dans le formulaire - Champ:", id, "Valeur:", value);

		setFormdata({
		  ...formdata,
		  [id]: type === 'checkbox' ? checked : value,
		});

		// Effacer l'erreur du champ modifié
		if (formErrors[id as keyof typeof formErrors]) {
		  setFormErrors({
			...formErrors,
			[id]: '',
		  });

		  console.log("Erreur après réinitialisation:", formErrors);

		}
	  };


	  // Gestion de la soumission du formulaire
	  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = {
		  user_name: formdata.user_name,
		  email: formdata.email,
		  password: formdata.password,
		  account_type: formdata.account_type
		};

		console.log("Données envoyées au serveur:", data);

		try {
			const validationResult = usersSchema.safeParse(data);
			if (!validationResult.success) {
				console.log("Erreurs de validation:", validationResult.error.errors);
			}

		console.log("Soumission du formulaire - Données actuelles:", data);
		setLoading(true);
		console.log("Statut de chargement mis à jour - loading:", loading);

		console.log("Envoi des données au serveur:", data);
		const response = await fetch('/api/auth/registerUser', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data),
		});
		const serverResponse = await response.json();

		console.log("Réponse du serveur:", response.status, serverResponse);

		if (response.ok) {
		  console.log("Réponse du serveur - Succès:", data);
		  setSuccess(true);
		  setOpen(true);
		} else {
		  console.log("Réponse du serveur - Erreur:", data);
		  setFormErrors({ ...formErrors, general: serverResponse.error || 'An error occurred' });
		}
		} catch (error) {
		  console.error('An unexpected error happened:', error);
		} finally {
		  setLoading(false);
		  console.log("Statut de chargement mis à jour - loading:", loading);
		}
	  };


  return (

<div className="min-h-[845px] h-screen flex bg-gray-50">
  <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 lg:flex-none xl:px-24">
	  <div className=" flex justify-center m-4">
		<Image className="rounded-xl shadow-md justify-center border border-gray-300" src="/logo.png" alt="logo" width={150}
            height={150} />
	  </div>
	<div className="mx-auto w-full max-w-sm lg:w-96">
	  <h2 className="font-poppins mt-6 mb-1 text-2xl font-semibold text-gray-900 md:text-3xl">Inscrivez-vous</h2>
		<a href="/login" className="font-sm text-amber-600 hover:text-amber-500">Vous avez déjà un compte ? Connectez-vous</a>
	  <form className='mt-4' onSubmit={handleSubmit}>
		<div className="space-y-6 mt-6 mb-3">
		  <div>
			<label htmlFor="user_name" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
			<input
			type="text"
			id="user_name"
			value={formdata.user_name}
			onChange={handleChange}
			required
			className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-amber-800 sm:text-sm"/>
			{formErrors.user_name && <p className="text-red-500 text-sm mt-1">{formErrors.user_name}</p>}
		  </div>

		  <div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
			<input
			type="email"
			id="email"
			value={formdata.email}
			onChange={handleChange}
			required
			className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-amber-800 sm:text-sm"/>
			{formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}

		  </div>

		  <div className='relative'>
			<label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
			<input
			type={showPassword ? 'text' : 'password'}
			id="password"
			name='password'
			value={formdata.password}
			onChange={handleChange}
			required
			className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"/>
			<button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center"
          >
            {showPassword ? (
				<EyeIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
			) : (
				<EyeSlashIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
			)}
          </button>
		  </div>
		  {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}


		  <div>
			<label htmlFor="account_type" className="block text-sm font-medium text-gray-700">Type de compte</label>
			<select
				id="account_type"
				value={formdata.account_type}
				onChange={handleChange}
				required
				className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-amber-800 sm:text-sm">
			  <option value="" disabled>Sélectionnez une option</option>
			  <option value="owner">Propriétaire</option>
			  <option value="user">Utilisateur</option>
			</select>
			{formErrors.account_type && <p className="text-red-500 text-sm mt-1">{formErrors.account_type}</p>}
		  </div>

		  <div className="flex justify-between items-center mt-4">
			<div className="flex items-center">
			  <input
				type="checkbox"
				id="acceptTerms"
				checked={formdata.acceptTerms}
				onChange={handleChange}
				className="h-4 w-4 rounded-xl"
				required
			  />
			  <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-900">
				J'accepte les <a href="" className="text-amber-600 hover:text-amber-500">conditions d'utilisation</a>
			  </label>
			</div>

			<div className="flex items-center">
			  <input type="checkbox" id="remember_me" className="h-4 w-4 rounded-xl "/>
			  <label htmlFor="remember_me"  className="ml-2 text-sm text-gray-900">Se souvenir de moi</label>
			</div>
		  </div>
		  {formErrors.acceptTerms && <p className="text-red-500 text-sm mt-1">{formErrors.acceptTerms}</p>}

		</div>

		<button
		type='submit'
		disabled={loading}
		className="w-full py-3 mt-6 flex justify-center items-center rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-500">
		{loading ? (
    	<div className="animate-spin rounded-full border-4 border-white border-t-transparent w-6 h-6"></div>
  		) : (
    	'Inscrivez-vous'
  		)}
		</button>
		{formErrors.general && <p className="text-red-500 text-center mt-4">{formErrors.general}</p>}
	  </form>

	</div>
  </div>

  <div className="hidden relative flex-1 sm:block">
	<Image src="/test3.png" alt="nature" className="h-full w-full object-cover" fill/>
  </div>

  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-md bg-slate-50">
      <div className="flex items-center justify-center ">
        <CheckCircle className="h-12 w-12 text-amber-600" />
      </div>
      <DialogHeader>
        <DialogTitle className="text-center">Inscription réussie !</DialogTitle>
        <DialogDescription className="text-center">
          Vous allez recevoir un mail de confirmation
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</div>

  );
}
