import { NextResponse } from 'next/server';
import { signOut } from 'next-auth/react';

// Route pour la déconnexion
export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    );

    // Supprimer le cookie
    response.cookies.delete('accesstoken');

	// Rediriger vers la page de login
	await signOut({ callbackUrl: '/auth/login' });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
