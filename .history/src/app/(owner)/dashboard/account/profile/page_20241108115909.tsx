"use client";
]import React from 'react'; // Import the 'React' library
import UserInfoForm from "@/components/UserInfoForm"


/**
 * Profil page.
 *
 * Cette page affiche les infos de chaque proprieter.
 */

export default function Profile_page() {
  return (
<div className=' bg-slate-50 w-full max-w-screen-xl p-4 flex items-start justify-start mx-auto'>
	<UserInfoForm/>
</div>

  );
}
