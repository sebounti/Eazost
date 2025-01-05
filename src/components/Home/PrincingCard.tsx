import React from 'react'

export default function PrincingCard() {
  return (
	<div>
		<section className="text-center max-w-7xl mx-auto py-20 px-4 sm:px-6 lg-px-8">
        	<h1 className="text-5xl font-extrabold text-gray-900">Formules</h1>
			<hr className="w-1/4 mt-5 mx-auto border-amber-900" />
        	<p className="mt-5 text-xl text-gray-600">Choisissez un forfait qui vous convient</p>
        	<div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            	<div className="bg-white rounded-lg shadow-lg p-8">
                	<h2 className="text-2xl font-bold text-gray-900">Basic</h2>
                	<p className="text-gray-600 mt-2">For small teams or side projects</p>
                	<p className="text-3xl font-bold text-amber-500 mt-5">€10</p>
                	<p className="text-gray-600 font-semibold italic mt-2">Par utilisateur, par mois</p>
					<ul className="mt-7">
						<li className="text-gray-600 m-2">Inclut les fonctionnalités essentielles pour les propriétaires et les vacanciers :</li>
						<li className="text-gray-600 m-2">➕ Limite a 1 logement</li>
						<li className="text-gray-600 m-2">➕ Priorité pour le support client</li>
						<li className="text-gray-600 m-2"></li>
					</ul>
                	<button className="mt-16 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded">Choose Basic</button>
            	</div>
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h2 className="text-2xl font-bold text-gray-900">Standard</h2>
					<p className="text-gray-600 mt-2">For growing teams</p>
					<p className="text-3xl font-bold text-amber-500 mt-5">€30</p>
					<p className="text-gray-600 font-semibold italic mt-2">Par utilisateur, par mois</p>
					<ul className="mt-7">
						<li className="text-gray-600 m-2">➕ Nombre illimité de logement</li>
						<li className="text-gray-600 m-2">➕ Intégration avec d'autres plateformes (Airbnb, Booking.com) pour synchroniser les réservations</li>
						<li className="text-gray-600 m-2">➕ Priorité pour le support client</li>
						<li className="text-gray-600 m-2">➕ Outils analytiques</li>
					</ul>
					<button className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded">Choose Pro</button>
				</div>
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h2 className="text-2xl font-bold text-gray-900">Premium</h2>
					<p className="text-gray-600 mt-2">For large teams</p>
					<p className="text-3xl font-bold text-amber-600 mt-5">€50</p>
					<p className="text-gray-600 font-semibold italic mt-2">Par utilisateur, par mois</p>
					<ul className="mt-7 ">
						<li className="text-gray-600 m-2">➕ Nombre illimité de logement</li>
						<li className="text-gray-600 m-2">➕ Intégration avec d'autres plateformes (Airbnb, Booking.com) pour synchroniser les réservations</li>
						<li className="text-gray-600 m-2">➕ Priorité pour le support client</li>
						<li className="text-gray-600 m-2">➕ Outils analytiques</li>
					</ul>
					<button className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded">Choose Enterprise</button>
				</div>
			</div>
    </section>
	</div>
  )
}
