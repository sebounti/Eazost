"use client";
import PropertyDashboard from '@/components/PropertyDashboard';
import React from 'react'; // Import the 'React' library
import Link from 'next/link'; // Import the 'Link' component from the 'next/link' module

/**
 * homepage Owner.
 *
 * Cette page affiche la page accueille de la section propriétaire.
 */
export default function Owner_homepage() {
  return (
		<div className="flex flex-col justify-center">
			<h1 className="flex text-3xl ml-4 font-bold text-[#444444]">Welcome to you service dashboard</h1>
			<p className="font-nunito flex text-m mt-3 ml-4 mb-8  text-[#444444]">Manage your property service, generate code, interact with clients, and stay updated with the latest.</p>
			<PropertyDashboard />
		</div>
  );
}
