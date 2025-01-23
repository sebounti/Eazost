import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { accommodation, stayInfo, shop } from "@/db/appSchema";
import { accommodationSchema } from "@/validation/PropertySchema";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

//----- Route properties -----//
// route pour les propriétés //

//----- GET -----//
// Route pour récupérer tous les logements ou les logements d'un utilisateur //
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

    const logements = await db.select({
      accommodation_id: accommodation.accommodation_id,
      name: accommodation.name,
      type: accommodation.type,
      photo_url: accommodation.photo_url,
      description: accommodation.description,
      address_line1: accommodation.address_line1,
      address_line2: accommodation.address_line2,
      city: accommodation.city,
      zipcode: accommodation.zipcode,
      country: accommodation.country,
      stayInfo: stayInfo
    })
    .from(accommodation)
    .leftJoin(stayInfo, eq(accommodation.accommodation_id, stayInfo.accommodation_id))
    .where(eq(accommodation.users_id, userId));

    // Restructurer les données pour regrouper les stayInfo par logement
    type AccommodationWithStayInfo = {
      accommodation_id: number;
      name: string;
      type: string;
      photo_url: string | null;
      description: string | null;
      address_line1: string;
      address_line2: string | null;
      city: string;
      zipcode: string;
      country: string;
      stayInfo: typeof stayInfo.$inferSelect[];
    };

    const restructuredData = logements.reduce<AccommodationWithStayInfo[]>((acc, current) => {
      const existingAccommodation = acc.find(a => a.accommodation_id === current.accommodation_id);

      if (existingAccommodation) {
        if (current.stayInfo) {
          existingAccommodation.stayInfo.push(current.stayInfo);
        }
      } else {
        acc.push({
          ...current,
          stayInfo: current.stayInfo ? [current.stayInfo] : []
        });
      }

      return acc;
    }, []);

    console.log('📦 API - Logements trouvés:', restructuredData.length);

    return NextResponse.json({
      message: restructuredData.length ? 'Logements trouvés' : 'Aucun logement trouvé',
      data: restructuredData
    });
  } catch (error) {
    console.error('❌ API - Erreur:', error);
    return NextResponse.json(
      { message: 'Erreur serveur', error: error instanceof Error ? error.message : 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

//----- POST -----//
// Route pour créer un nouveau logement //
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('📦 Données reçues:', JSON.stringify(data, null, 2));

    // Validation avec Zod
    const validated = accommodationSchema.parse(data);
    console.log('✅ Données validées:', JSON.stringify(validated, null, 2));

    const uuid = crypto.randomUUID();

    // Créer le logement dans la base de données
    const result = await db.insert(accommodation).values({
      ...validated,
      uuid,
      created_at: new Date(),
      updated_at: new Date()
    }).execute();

    // récupérer le logement créé avec l'ID auto-incrémenté
    const [newAccommodation] = await db.select().from(accommodation)
      .where(eq(accommodation.uuid, uuid))
      .limit(1);

    // ajouter un shop
    await db.insert(shop).values({
      accommodation_id: newAccommodation.accommodation_id,
      name: validated.name,
      uuid: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date()
    });

    return NextResponse.json(
      { message: 'Logement créé avec succès', data: result },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Erreur détaillée:", {
      name: (error as Error).name,
      message: (error as Error).message,
      errors: (error as ZodError).errors
    });

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la création du logement" },
      { status: 500 }
    );
  }
}
