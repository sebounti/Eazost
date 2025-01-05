// app/api/logements/[id]/route.ts
import { NextResponse } from "next/server";
import db from "@/db/db";
import { accommodation, stayInfo, shop, accessCode } from "@/db/appSchema";
import { eq } from "drizzle-orm";

// Gestion de toutes les requêtes pour /api/logements/[id]

// GET pour récupérer un logement
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const logement = await db
    .select()
    .from(accommodation)
    .where(eq(accommodation.accommodation_id, parseInt(params.id)))
    .then((results) => results[0]);
  return NextResponse.json(logement);
}

// Route PATCH pour mettre à jour un logement
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();

    // Convertir FormData en objet
    const updateData = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      address_line1: formData.get('address_line1') as string,
      address_line2: formData.get('address_line2') as string || null,
      city: formData.get('city') as string,
      zipcode: formData.get('zipcode') as string,
      country: formData.get('country') as string,
      description: formData.get('description') as string,
      photo_url: formData.get('photo_url') as string,
      updated_at: new Date()
    };

    // Mise à jour dans la base de données
    await db.update(accommodation)
      .set(updateData)
      .where(eq(accommodation.accommodation_id, id));

    // Récupérer le logement mis à jour
    const updatedAccommodation = await db
      .select()
      .from(accommodation)
      .where(eq(accommodation.accommodation_id, id))
      .then(results => results[0]);

    return NextResponse.json(updatedAccommodation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// Route DELETE pour supprimer un logement
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    // Supprimer d'abord les données liées
    await db.delete(stayInfo)
      .where(eq(stayInfo.accommodation_id, id));

    await db.delete(accessCode)
      .where(eq(accessCode.accommodation_id, id));

    await db.delete(shop)
      .where(eq(shop.accommodation_id, id));

    // Enfin, supprimer le logement
    const result = await db.delete(accommodation)
      .where(eq(accommodation.accommodation_id, id));

    return new NextResponse(JSON.stringify({ success: true, message: 'Logement et données associées supprimés' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return new NextResponse(JSON.stringify({ success: false, error: 'Erreur lors de la suppression' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
