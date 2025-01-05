import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm/expressions';
import db from '@/db/db';
import { users } from '@/db/appSchema';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await db
    .select({
      users_id: users.users_id,
      user_name: users.user_name,
      email: users.email,
      account_type: users.account_type
    })
    .from(users)
    .where(eq(users.users_id, Number(params.id)))
    .limit(1);

  return NextResponse.json(user[0]);
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        console.log("Données reçues :", data);

    } catch (error) {
        console.error("Erreur dans PUT :", error);
        return NextResponse.json({ error: "Erreur de traitement des données" }, { status: 400 });
    }
}
