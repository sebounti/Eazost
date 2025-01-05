// app/api/logements/route.ts
import { NextResponse } from "next/server";
import db from "@/db/db";
import { accommodation } from "@/db/schema";


// Gestion de toutes les requêtes pour /api/logements
export async function GET() {
  const logements = await db.select().from(accommodation);
	return NextResponse.json(logements);
}

export async function POST(request: Request) {
  const data = await request.json();

  // Créer un nouveau logement
  const newLogement = await db.insert(accommodation).values(data).$returningId();

  return NextResponse.json(newLogement, { status: 201 });
}
