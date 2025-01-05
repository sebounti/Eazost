'use client';

import UserInfo from '@/components/UserInfo';
import UploadImage from '@/components/general/UploadImage';

export default function testPage() {
  return (
    <main>
      <h1>Bienvenue sur la page d&apos;accueil test cloudinary</h1>
      <UploadImage />
	  <UserInfo />
    </main>
  );
}
