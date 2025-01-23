import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { users } from '@/db/authSchema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

//----- VALIDATION EMAIL -----//
// Permet de vérifier si l'email est valide //


//----- GET -----//
// Route pour vérifier si l'email est valide //
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    console.log("URL reçue:", request.url);
    console.log("Token reçu:", token);

    if (!token) {
      console.log("Erreur: Token manquant");
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    // Vérifier le token
    console.log("Vérification du token avec secret:", process.env.JWT_SECRET?.substring(0, 5) + "...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { email: string };
    console.log("Token décodé:", decoded);

    // Mettre à jour l'utilisateur
    console.log("Mise à jour de l'email:", decoded.email);
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.email, decoded.email));

    console.log("Mise à jour réussie");
    return NextResponse.json(
      { message: 'Email vérifié avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur détaillée de vérification:', error);
    return NextResponse.json(
      { error: 'Erreur de vérification de l\'email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
