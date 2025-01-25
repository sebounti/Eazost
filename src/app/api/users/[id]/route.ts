//	api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm/expressions';
import {db} from '@/db/db';
import { users } from '@/db/authSchema';

//----- route users -----//
// route pour les utilisateurs //

//----- GET -----//
// Route pour récupérer les informations d'un utilisateur //
export async function GET(request: Request	, { params }: { params: { id: string } }) {
  const user = await db
    .select({
      id: users.id,
      user_name: users.user_name,
      email: users.email,
      account_type: users.account_type
    })
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1);

  return NextResponse.json(user[0]);
}

//----- PUT -----//
// Route pour mettre à jour les informations d'un utilisateur //
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        console.log("Données reçues :", data);

    } catch (error) {
        console.error("Erreur dans PUT :", error);
        return NextResponse.json({ error: "Erreur de traitement des données" }, { status: 400 });
    }
}


//----- DELETE -----//
// Route pour supprimer un utilisateur //
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'ID manquant' }, { status: 400 });
    }
}
