"use client";

// button component

interface ButtonProps {
	label: string;
	onClick?: () => void;
	className?: string; // Permet de passer des classes supplémentaires si nécessaire
	variant?: "primary" | "secondary"; // Optionnel : tu peux définir des variantes de bouton
  }

  export default function Button({
	label,
	onClick,
	className = "", // Valeur par défaut vide si aucune classe n'est passée
	variant = "primary", // Le variant par défaut est "primary"
  }: ButtonProps) {
	// Styles par défaut en fonction du variant
	const baseStyles = variant === "primary"
	  ? "bg-amber-500 p-4 text-white rounded-xl shadow-lg hover:bg-neutral-200"
	  : "bg-slate-100 p-4 text-gray-700 rounded-xl shadow-lg hover:bg-amber-100";

	return (
	  <button
		onClick={onClick}
		className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${baseStyles} ${className}`}
	  >
		{label}
	  </button>
	);
  }
