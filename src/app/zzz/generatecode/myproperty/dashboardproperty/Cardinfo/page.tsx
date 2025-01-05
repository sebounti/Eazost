"use client";
import PropertyDashboard from '@/components/PropertyDashboard';
import React from 'react'; // Import the 'React' library
import Link from 'next/link'; // Import the 'Link' component from the 'next/link' module
import { IoIosReturnLeft } from "react-icons/io";


/**
 * homepage Owner.
 *
 * Cette page affiche les card info de chaque proprieter.
 */

export default function CardInfo_Page() {
  return (
		<div className="flex flex-col justify-center">
			<div className='flex items-center'>
			<h1 className="flex text-3xl ml-4 font-bold text-[#444444]">Card Info</h1>
			<Link href="/owner/myproperty/dashboardproperty" passHref className="ml-2">
					<IoIosReturnLeft
					className="text-3xl text-[#444444] hover:text-white" />
			</Link>
			</div>

			<p className="font-nunito flex text-m mt-3 ml-4 mb-8  text-[#444444]">Here you&apos;ll find all the essential information you need to make your booking, including accommodation details and instructions for a carefree stay. We&apos;ve put together everything you need to prepare and enjoy</p>
		</div>
  );
}
