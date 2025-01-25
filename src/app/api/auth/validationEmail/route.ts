import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { usersVerification } from '@/db/authSchema';
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

    const verification = await db.query.usersVerification.findFirst({
      where: eq(usersVerification.email, email)
    });

    return NextResponse.json({
      verified: !!verification?.verified_at
    });
  } catch (error) {
    console.error('Erreur validation email:', error);
    return NextResponse.json({ verified: false });
  }
}
