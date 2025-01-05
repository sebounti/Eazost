"use client";
import Forminfo from '@/components/Forminfo';
import { useState } from 'react';
import React from 'react'; // Import the 'React' library
import Link from 'next/link'; // Import the 'Link' component from the 'next/link' module
import ImageUpload from '@/components/ImageUpload'; // Import the 'ImageUpload' component
import { IoIosReturnLeft } from "react-icons/io";


/**
 * Property info page.
 *
 * Cette page affiche les infos de chaque proprieter.
 */

export default function PropertyInfo_page() {
  return (
	<div className="flex flex-col justify-center">
		<div className="flex items-center">
			<h1 className="flex text-3xl ml-4 font-bold text-[#444444]">Property Info</h1>
			<Link href="/owner/myproperty/dashboardproperty" passHref className="ml-2">
					<IoIosReturnLeft
					className="text-3xl text-[#444444] hover:text-white" />
			</Link>
		</div>
		<div>
			<p className="font-nunito flex text-m mt-3 ml-4 mb-8 text-[#444444]">
			Manage your property service, generate code, interact with clients, and stay updated with the latest.
			</p>
		</div>


      <div className="flex flex-col h-screen">
        <div className="flex flex-row justify-between h-full">
          {/* Colonne gauche */}
          <div className="flex flex-col w-1/4 h-full bg-[white]">
		  <ImageUpload/>
          </div>

          {/* Séparateur */}
          <div className="mx-auto h-full flex ">
            <div className="h-3/4 w-[3px] bg-[#F2F4F9]"></div>
          </div>

          {/* Colonne droite */}
          <div className="flex flex-col w-3/4 h-full">
		  	<div className="p-3 bg-[white]">
			<Forminfo/>
			</div>
          </div>
        </div>
      </div>
    </div>
  );
}
