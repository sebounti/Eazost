import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { stayInfo } from "@/db/appSchema";
import { eq } from "drizzle-orm";
import { pool } from "@/db/db";


// GET - Récupérer les informations d'un logement
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const connection = await pool.getConnection();
  try {
    const logementId = parseInt(params.id);

    if (isNaN(logementId)) {
      throw new Error('ID de logement invalide');
    }

	// on récupère les informations du logement en fonction de l'id du logement
    const infoCards = await db
      .select()
      .from(stayInfo)
      .where(eq(stayInfo.accommodation_id, logementId));

	// on sérialise les données du logement
    const serializedCards = infoCards.map(card => ({
      ...card,
      created_at: card.created_at instanceof Date ? card.created_at.toISOString() : null,
      updated_at: card.updated_at instanceof Date ? card.updated_at.toISOString() : null
    }));

    return NextResponse.json(serializedCards);

  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json([], { status: 500 });
  } finally {
    connection.release();
  }
}
