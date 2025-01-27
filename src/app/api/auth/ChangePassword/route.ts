import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { users } from '@/db/authSchema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

//----- CHANGE PASSWORD -----//
// Permet de changer le mot de passe de l'utilisateur //


// Permet de changer le mot de passe de l'utilisateur //
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.sub) {
      return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Vérifier l'utilisateur
    const user = await db.query.users.findFirst({
      where: eq(users.id, token.sub)
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Mot de passe actuel incorrect' }, { status: 400 });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, token.sub));

    return NextResponse.json({ success: true, message: 'Mot de passe mis à jour' });
  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
