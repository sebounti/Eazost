import { NextResponse } from 'next/server';
import { signOut } from 'next-auth/react';
import { TOKEN_CONFIG } from '@/app/api/services/tokenService';

//----- LOGOUT -----//
// Permet de se déconnecter de l'application //


//----- POST -----//
// Route pour la déconnexion //
export async function POST() {
	console.log("🔴 Déconnexion en cours...");
  try {
    const response = NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    );

    // Utiliser les bons noms de cookies
    response.cookies.set(TOKEN_CONFIG.NAMES.ACCESS, '', { maxAge: 0 });
    response.cookies.set(TOKEN_CONFIG.NAMES.REFRESH, '', { maxAge: 0 });
	response.cookies.set('next-auth.session-token', '', { maxAge: 0 });

	console.log("🔴 cookie supprimé, Déconnexion réussie");

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
