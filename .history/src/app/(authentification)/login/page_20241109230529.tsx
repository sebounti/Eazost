'use client';
import '@/app/globals.css'; // Assurez-vous que le chemin est correct
import Image from "next/image";
import { useState } from "react";
import { loginSchema } from '@/validation/UserSchema';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useUser } from "@/context/userContext";


export default function RegisterPage() {

	const { setCurrentUser } = useUser(); // Accéder à setCurrentUser depuis le contexte

	// Pour gérer les données du formulaire
	const [formdata, setFormdata] = useState({
		email: '',
		password: '',
	  });

	const [rememberMe, setRememberMe] = useState(false);
	const [Error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	  const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	  }


	// Pour gérer les erreurs de connexion
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = loginSchema.safeParse(formdata);
		if(!result.success) {
			setError(result.error.errors[0].message);
			return;
		}

		// Gestion des erreurs de connexion
		try {
			const { email, password } = formdata;
			const response = await fetch("/api/connexion/auth", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({ email, password }),
			});

			// Vérifie si la réponse est correcte
			if (response.ok) {
			  const data = await response.json();

			  if (data.token) {
				localStorage.setItem("token", data.token);
				console.log("Token enregistré :", localStorage.getItem("token"));
			  }

			  // Mettre à jour `currentUser` dans le contexte après une connexion réussie
			  setCurrentUser({
				id: data.user_id,   // Remplace par le bon identifiant
				name: data.user_name, // Remplace par le bon nom d'utilisateur
				role: data.user_role, // Remplace par le bon rôle d'utilisateur
			  });

			  console.log(data);  // Affiche les données pour vérifier si tout est correct


			  // Enregistre le token dans le stockage local
			  if (data.token) {
				  localStorage.setItem("token", data.token);
				  console.log("Token enregistré :", localStorage.getItem("token"));
			  }

			  console.log("Type de compte :", data.account_type);

			  // Redirige l'utilisateur en fonction de son type de compte
			  if (data.account_type === "owner") {
				  console.log("Redirection vers /dashboard");
				  setTimeout(() => {
					window.location.href = "/dashboard";
				  }, 500);
				  }
				   else if (data.account_type === "user") {
				  console.log("Redirection vers /dashboard");
				  setTimeout(() => {
					window.location.href = "/dashboard";
				  }, 500);  // Ajoute un délai de 500ms
				}

				// Gère les erreurs de connexion
		  } else {

			// Si la réponse n'est pas correcte
			try {
			  const errMessage = await response.json();
			  setError(errMessage.error || "Une erreur s'est produite. Veuillez réessayer.");
			} catch {
			  setError("Une erreur s'est produite. Veuillez réessayer.");  // Si la réponse n'est pas en JSON
			}
		  }
		  } catch (err: unknown) {
			// Convertir l'erreur en chaîne de caractères de manière sécurisée
			if (err instanceof Error) {
			  setError(err.message);
			} else {
			  setError("Une erreur inconnue s'est produite.");
			}
			console.error("Erreur lors de la redirection :", err);
		  }
	};

  return (

<div className="min-h-[845px] h-screen flex bg-gray-50">
  <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 lg:flex-none xl:px-24">
	  <div className=" flex justify-center m-4">
		<Image className="mb-6 rounded-xl shadow-md justify-center border border-gray-300"
		src="/logo.png"
		alt="logo"
		width={150}
        height={150} />
	  </div>
	<div className="mx-auto w-full max-w-sm lg:w-96">
	  <form onSubmit={handleSubmit} className='mt-4'>
		<div className="space-y-6 mt-6 mb-3">
		  <div>
			<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
			<input type="email" id="email" required
			className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
			value={formdata.email}
			onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}  // Capture l'email
			/>
		  </div>
		  <div className='relative'>
			<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
			<input
			type={showPassword ? 'text' : 'password'}
			id="password"
			required
			className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
			value={formdata.password}
			onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}  // Capture le mot de passe
			/>
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
		</div>
		{Error && <p className="text-red-500 mt-2">{typeof Error === "string" ? Error : "Une erreur s'est produite."}</p>}

		<div className="flex items-center justify-between mt-6">
		  <div className="flex items-center">
			<input
			type="checkbox"
			id="remember_me"
			className="h-4 w-4 rounded-xl"
			checked={rememberMe}
			onChange={(e) => setRememberMe(e.target.checked)}
			/>
			<label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Remember me</label>
		  </div>
		  <a href="#" className="text-sm font-medium ml-28 text-amber-600 hover:text-amber-400">Need help to sign in ?</a>
		</div>

		<button className="w-full py-3 mt-6 rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-500">Sign Up</button>
	  </form>

	  <div className="mt-6">
		<p className="px-2 mb-2 mt-8 text-center text-gray-500">Or sign up with</p>
	  </div>

	  <div className="mt-1 flex justify-center">
		<a href="#" className="mx-2 p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
			<span className="sr-only">Sign up with Facebook</span>
			<Image src="/facebook.svg"
					alt=""
					className="w-6"
					width={24}
					height={24}/>
		</a>
		<a href="#" className="mx-2 p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
			<span className="sr-only">Sign up with Google</span>
			<Image src="/Google.svg"
					alt=""
					className="w-6"
					width={24}
					height={24}/>
		</a>
	  </div>
	</div>
  </div>

  <div className="hidden relative flex-1 sm:block">
	<Image src="/photo1.jpg"
		   alt="nature"
		   className="h-full w-full object-cover"
		   fill/>
  </div>
</div>

  );
}
