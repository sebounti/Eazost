"use client";
import PropertyDashboard from '@/components/PropertyDashboard';
import React from 'react'; // Import the 'React' library
import Link from 'next/link'; // Import the 'Link' component from the 'next/link' module
import { IoIosReturnLeft } from "react-icons/io";


/**
 * Manage acess page.
 *
 * Cette page permet de gérer les accès du logement.
 */

export default function ManageAcess_Page() {
  return (
		<div className="flex flex-col justify-center">
			<div className='flex items-center'>
			<h1 className="flex text-3xl ml-4 font-bold text-[#444444]">Management Acess</h1>
			<Link href="/owner/myproperty/dashboardproperty" passHref className="ml-2">
					<IoIosReturnLeft
					className="text-3xl text-[#444444] hover:text-white" />
				</Link>
			</div>
			<p className="font-nunito flex text-m mt-3 ml-4 mb-8  text-[#444444]">Manage your acess, </p>
		</div>
  );
}
