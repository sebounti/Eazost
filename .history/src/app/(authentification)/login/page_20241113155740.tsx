'use client';

import '@/app/globals.css'; // Assurez-vous que le chemin est correct
import Image from "next/image";
import { useState } from "react";
import { loginSchema } from '@/validation/UserSchema';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useUser } from '@/context/userContext';

export default function LoginPage() {
  // Pour gérer les données du formulaire
  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [Error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser, currentUser } = useUser();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Pour gérer les erreurs de connexion
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formdata);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      const { email, password } = formdata;
      const response = await fetch("/api/connexion/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
		console.log("Réponse de l'API :", data); // Vérifie si le token est dans cette réponse

		// Enregistre le token dans `localStorage`
		if (data.token) {
			localStorage.setItem('token', data.token);
			console.log("Token sauvegardé dans localStorage :", data.token);
		  }

        // Vérifie que l'objet `user` est bien défini avec les bonnes clés
        if (data.users_id && data.account_type) {
      const user = {
        users_id: data.users_id,
        account_type: data.account_type,
        isAuthenticated: true,
		isLogged: true,
      };

	  		// Appelle la fonction `handleLogin` pour mettre à jour le contexte utilisateur
			handleLogin(user);

			// Met à jour le contexte utilisateur avec le nouvel utilisateur
			setCurrentUser(user);
			console.log("currentUser après setCurrentUser:", currentUser);
		  }

        alert("Connexion réussie !");

        // Redirige l'utilisateur après une courte pause
        setTimeout(() => {
          if (data.account_type === "owner") {
            window.location.href = "/dashboard";
          } else if (data.account_type === "user") {
            window.location.href = "/dashboard";
          }
        }, 500);
      } else {
        // Si la réponse est incorrecte, gérer l'erreur de manière sécurisée
        try {
          const errMessage = await response.json();
          setError(
            typeof errMessage.error === "string"
              ? errMessage.error
              : "Une erreur s'est produite. Veuillez réessayer."
          );
        } catch {
          setError("Une erreur s'est produite. Veuillez réessayer.");
        }
      }
    } catch (err: unknown) {
      if (err instanceof globalThis.Error) {
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
          <Image
            className="mb-6 rounded-xl shadow-md justify-center border border-gray-300"
            src="/logo.png"
            alt="logo"
            width={150}
            height={150}
          />
        </div>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-6 mt-6 mb-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
                  value={formdata.email}
                  onChange={(e) =>
                    setFormdata({ ...formdata, email: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
                  value={formdata.password}
                  onChange={(e) =>
                    setFormdata({ ...formdata, password: e.target.value })
                  }
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
            {Error && (
              <p className="text-red-500 mt-2">
                {typeof Error === "string" ? Error : "Une erreur s'est produite."}
              </p>
            )}

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember_me"
                  className="h-4 w-4 rounded-xl"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium ml-28 text-amber-600 hover:text-amber-400">
                Need help to sign in ?
              </a>
            </div>

            <button className="w-full py-3 mt-6 rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-500">
              Sign Up
            </button>
          </form>

          <div className="mt-6">
            <p className="px-2 mb-2 mt-8 text-center text-gray-500">Or sign up with</p>
          </div>

          <div className="mt-1 flex justify-center">
            <a href="#" className="mx-2 p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
              <span className="sr-only">Sign up with Facebook</span>
              <Image src="/facebook.svg" alt="" className="w-6" width={24} height={24} />
            </a>
            <a href="#" className="mx-2 p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
              <span className="sr-only">Sign up with Google</span>
              <Image src="/Google.svg" alt="" className="w-6" width={24} height={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="hidden relative flex-1 sm:block">
        <Image src="/photo1.jpg" alt="nature" className="h-full w-full object-cover" fill />
      </div>
    </div>
  );
}
