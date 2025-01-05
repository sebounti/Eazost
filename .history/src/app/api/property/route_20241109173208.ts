// app/api/logements/route.ts
import { NextResponse } from "next/server";
import db from "@/db/db";
import { accommodation } from "@/db/schema";


// Gestion de toutes les requêtes pour /api/logements
export async function GET() {
  console.log('GET request received');
  const logements = await db.select().from(accommodation);
  console.log('Fetched logements:', logements);
  return NextResponse.json(logements);
}

export async function POST(request: Request) {
  console.log('POST request received');
  const data = await request.json();
  console.log('Request data:', data);

  // Créer un nouveau logement
  const newLogement = await db.insert(accommodation).values(data).$returningId();
  console.log('New logement created with ID:', newLogement);

  return NextResponse.json(newLogement, { status: 201 });
}
