import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { accommodation, stayInfo, shop, accessCode } from "@/db/appSchema";
import { eq } from "drizzle-orm";

//----- route properties -----//
// route pour les propriétés //

//----- GET -----//
// Route pour récupérer un logement //
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const logement = await db
    .select()
    .from(accommodation)
    .where(eq(accommodation.accommodation_id, parseInt(params.id)))
    .then((results) => results[0]);
  return NextResponse.json(logement);
}

//----- PUT -----//
// Route pour mettre à jour un logement //
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const updatedProperty = await db
      .update(accommodation)
      .set({
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
      })
      .where(eq(accommodation.accommodation_id, parseInt(params.id)));

    return Response.json(updatedProperty);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return Response.json({ error: 'Échec de la mise à jour' }, { status: 500 });
  }
}

//----- DELETE -----//
// Route pour supprimer un logement //
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
