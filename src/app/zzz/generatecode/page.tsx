import { IoIosReturnLeft } from "react-icons/io";
import React from 'react'; // Import the 'React' library
import Card_Codeaccess from '@/components/demos/ui/card_codeaccess';
import Link from 'next/link'; // Import the 'Link' component from the 'next/link' module

/**
 * Generate code page.
 *
 * Cette page affiche le profile du propriétaire.
 */
export default function generate_page() {
  return (
	<main>
		<div className="flex flex-col justify-center">
			<div className='flex items-center'>
				<h1 className="flex text-3xl ml-4 font-bold text-[#444444]">Generate Code Acess</h1>
				<Link href="/owner" passHref className="ml-2">
					<IoIosReturnLeft
					className="text-3xl text-[#444444] hover:text-white" />
				</Link>
			</div>
				<p className="font-nunito text-basic flex text-sm mt-3 ml-4 mb-8 text-[#444444]">Manage your accomodation, add service for you customers and add the latest information.</p>
			<div>
			<Card_Codeaccess />
			</div>
		</div>
	</main>
  );
};
