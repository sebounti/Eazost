import { NextResponse } from "next/server";
import { eq } from 'drizzle-orm';  // Replace 'drizzle-orm' with the actual library name if different
import {db} from '@/db/db';  // Assure-toi que ton instance de base de données est correctement importée
import { stayInfo } from '@/db/appSchema';  // Schéma de ta table dans la base de données
import { CardSchema } from '@/validation/CardSchema';  // Schéma de validation Zod

//----- route cards -----//
// route pour les cartes //


//----- GET -----//
// Route pour récupérer les cartes //
export async function GET() {
  try {
    // Récupérer les cartes depuis la base de données
    const cards = await db.select().from(stayInfo);

    // Retourner les cartes au format JSON
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    // Gérer les erreurs de la requête
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

//----- POST -----//
// Route pour créer une nouvelle carte //
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();

    // Validation des données avec Zod
    const parsedCard = CardSchema.parse(body);

	const accommodation_id = parsedCard.accommodation_id;

	if (!accommodation_id) {
		return NextResponse.json({ error: "accommodation_id is required"}, {status: 400})
	}

    // Insérer une nouvelle carte dans la base de données
    const [newCard] = await db
      .insert(stayInfo)  // `stayInfo` est le schéma de la table
      .values({
        ...parsedCard,
    accommodation_id: accommodation_id || 0,  // Assurez-vous que accommodation_id est présent
      })
      .$returningId();  // Retourner l'ID de la nouvelle carte insérée

    // Retourner la nouvelle carte au format JSON
    return NextResponse.json(newCard, { status: 201 });
  } catch (err: any) {
    // En cas d'erreur de validation ou d'insertion
    return NextResponse.json({ error: err.errors || "Failed to create card" }, { status: 400 });
  }
}

//----- DELETE -----//
// Route pour supprimer une carte //
export async function DELETE(req: Request): Promise<NextResponse> {
try{
	const body = await req.json();
	const { id } = body;

	if (!id) {
			return NextResponse.json({ error: "Card ID is required" }, { status: 400 });
		}

    // Supprimer la carte de la base de données
    const deletedCard = await db
      .delete(stayInfo)
      .where(eq(stayInfo.stay_info_id, id))
      .execute();  // Exécuter la suppression de la carte

    if (!deletedCard) {
		return NextResponse.json({ error: "Card not found" }, { status: 404 });
		}

		// Retourner la carte supprimée au format JSON
		return NextResponse.json(deletedCard[0], { status: 200 });
		} catch (err: any) {
		// En cas d'erreur de suppression
		return NextResponse.json({ error: err.errors || "Failed to delete card" }, { status: 500 });
	}
}
