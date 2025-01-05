"use client";
import FormProfil from '@/components/FormProfil';
import React from 'react'; // Import the 'React' library
import Link from 'next/link'; // Import the 'Link' component from the 'next/link' module
import UserInfoForm from "@/components/UserInfoForm"


/**
 * Profil page.
 *
 * Cette page affiche les infos de chaque proprieter.
 */

export default function PropertyInfo_page() {
  return (
<div className=' bg-slate-50 w-full max-w-screen-xl p-4 flex items-center justify-start mx-auto'>
	<UserInfoForm/>
</div>

  );
}
