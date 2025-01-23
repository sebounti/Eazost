import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { stayInfo } from "@/db/appSchema";
import { eq } from "drizzle-orm";
import { pool } from "@/db/db";

//----- route stay-info -----//
// route pour les informations de séjour //

//----- GET -----//
// Route pour récupérer les informations d'un logement //
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accommodationId = parseInt(params.id);

    const stayInfos = await db
      .select()
      .from(stayInfo)
      .where(eq(stayInfo.accommodation_id, accommodationId));

    return NextResponse.json(stayInfos);
  } catch (error) {
    console.error('Erreur lors de la récupération des stay info:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
