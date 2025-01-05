import React from 'react';
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
	<div className="flex flex-col justify-center items-center ">
		<h2 className="text-3xl text-[black] text-center">Oh, no! You seem to have taken a wrong turn.. This page does not exist</h2>

	<Image
		className="rounded-xl mt-4" // Ajoute une marge au-dessus de l'image
		src="/error404.webp"
		alt="page erreur 404"
		width={600}
		height={200}
	/>

	<Link href="/" className="text-3xl text-[black] mt-4">return Home</Link>
	</div>
  );
}
