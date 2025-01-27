import { NextResponse } from 'next/server';

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

    // Supprimer tous les cookies d'authentification
    response.cookies.set('next-auth.session-token', '', { maxAge: 0 });
    response.cookies.set('next-auth.csrf-token', '', { maxAge: 0 });
    response.cookies.set('next-auth.callback-url', '', { maxAge: 0 });
    response.cookies.set('auth.access_token', '', { maxAge: 0 });
    response.cookies.set('auth.refresh_token', '', { maxAge: 0 });

	console.log("🔴 cookie supprimé, Déconnexion réussie");

    return response;
  } catch (error) {
    console.error('❌ Erreur déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
