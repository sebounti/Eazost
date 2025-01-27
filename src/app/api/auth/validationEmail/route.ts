import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { verificationTokens } from '@/db/authSchema';
import { eq } from 'drizzle-orm';

//----- VALIDATION EMAIL -----//
// Permet de vérifier si l'email est valide //


//----- GET -----//
// Route pour vérifier si l'email est valide //
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ verified: false });
    }

    const verification = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.identifier, email)
    });

    return NextResponse.json({
      verified: !!verification?.expires
    });
  } catch (error) {
    console.error('Erreur validation email:', error);
    return NextResponse.json({ verified: false });
  }
}
