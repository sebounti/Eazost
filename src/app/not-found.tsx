//--- Page non trouvée ---//

import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
	<p className="text-2xl font-semibold mb-4">Désolé, la page que vous recherchez n'existe pas.</p>
	  <img src="/404.webp" alt="404" className="w-1/3 h-1/3 rounded-xl" />
	  <Link href="/home" className="text-xl tracking-wide shadow-sm text-amber-700 mr-7 mt-5">Retour à l'accueil</Link>
    </div>
  );
}
