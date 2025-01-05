// app/api/logements/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { accommodation } from "@/db/appSchema";
import { accommodationSchema } from "@/lib/validations/accommodation";
import { eq } from "drizzle-orm";

// GET pour récupérer tous les logements ou les logements d'un utilisateur
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('🔍 API - userId reçu:', userId, 'type:', typeof userId);

    if (!userId) {
      console.log('❌ API - userId manquant');
      return NextResponse.json(
        { message: 'UserId est requis', data: [] },
        { status: 400 }
      );
    }

    console.log('🔄 API - Début de la requête');
    console.log('📦 API - Instance db:', !!db);
    console.log('📦 API - Instance accommodation:', !!accommodation);

    const query = db.select().from(accommodation).where(eq(accommodation.users_id, userId));
    console.log('🔍 API - Requête SQL:', query.toSQL());

    const logements = await query;
    console.log('📦 API - Logements trouvés:', logements.length, 'logements:', logements);

    return NextResponse.json({
      message: logements.length ? 'Logements trouvés' : 'Aucun logement trouvé',
      data: logements
    });
  } catch (error) {
    console.error('❌ API - Erreur:', error);
    return NextResponse.json(
      { message: 'Erreur serveur', error: error instanceof Error ? error.message : 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Création d'un nouveau logement
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Vérifier que photo_url est présent
    if (!data.photo_url) {
      return NextResponse.json(
        { success: false, message: "L'URL de la photo est requise" },
        { status: 400 }
      );
    }

    // Vérifier les données avec le schéma
    const validated = accommodationSchema.parse(data);

    // Créer les données pour la base de données
    const accommodationData = {
      ...validated,
      users_id: validated.user_id,
      uuid: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      photo_url: data.photo_url,
    };

    const result = await db.insert(accommodation).values(accommodationData);
    return NextResponse.json(accommodationData);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur lors de la création du logement" }, { status: 500 });
  }
}
