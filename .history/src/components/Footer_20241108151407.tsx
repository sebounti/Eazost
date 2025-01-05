// components/Footer.js
"use client"
import Image from "next/image";


interface FooterProps {
  className: string;
}

export default function Footer({ }: FooterProps) {
  return (

	<footer className="mt-auto bg-slate-50">


	  <div className="max-w-xl mx-auto p-4 grid grid-cols-2 lg:max-w-7xl lg:grid-cols-5 md:py-10">


		<div className="m-3 md:m-5">
		  <h5 className="mb-3 text-gray-900 text-lg font-thin sm:text-xl">Eazost</h5>
		  <ul>
			<li className="my-2 text-gray-800 text-sm sm:text-md">À propos</li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Team</li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Blog</li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Avis des utilisateurs </li>
		  </ul>
		</div>

		<div className="m-3 md:m-5">
		  <h5 className="mb-3 text-gray-900 text-lg font-thin sm:text-xl">Legal</h5>
		  <ul>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Conditions d&apos;utilisation</li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Politique de confidentialité </li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Mentions légales </li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Conformité RGPD</li>
		  </ul>
		</div>

		<div className="m-3 md:m-5">
		  <h5 className="mb-3 text-gray-900 text-lg font-thin sm:text-xl">Aide</h5>
		  <ul>
			<li className="my-2 text-gray-800 text-sm sm:text-md">FAQ</li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Support client</li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Centre d&apos;aide</li>
			<li className="my-2 text-gray-800 text-sm sm:text-md">Guide d&apos;utilisation</li>
		  </ul>
		</div>


		<div className="col-span-2 mt-5 md:m-5">
		  <h3 className="mb-5 font-semibold text-gray-800 tracking-wider uppercase text-sm sm:text-lg">
			Suiver nous
		  </h3>
		  <ul className="flex space-x-6 md:order-2">

			<a href="#" className="text-gray-400 hover:text-gray-500">
			<Image src="/twitter-sign.svg" alt="twitter icone" className="w-6" width={60}  height={60}/>
			</a>

			<a href="#" className="text-gray-400 hover:text-gray-500">
			<Image src="/instagram.svg" alt="instagram icone" className="w-6" width={60}  height={60}/>
			</a>

			<a href="#" className="text-gray-400 hover:text-gray-500">
			<Image src="/facebook.svg" alt="facebook" className="w-6" width={60}  height={60}/>
			</a>

		</ul>
		</div>
	  </div>

	  <div className="max-w-7xl mx-auto border-t border-gray-200 py-2 px-4 flex flex-col items-center md:flex-row md:py-5 md:justify-between">
		<p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">&copy; EaZost, All rights reserved</p>
	  </div>

	</footer>
  );
}
