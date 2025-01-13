import { db } from '@/db/db';
import { NextResponse } from 'next/server';
import { product } from '@/db/appSchema';
import { eq } from 'drizzle-orm';


// POST - Créer un produit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('=== POST /api/shop/products ===');
    console.log('Body:', body);

    // Validation
    if (!body.name || !body.description || !body.price || !body.stock || !body.shop_id) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

	// on crée un produit
    const result = await db.insert(product).values({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      image_url: body.image_url || null,
      shop_id: body.shop_id,
      uuid: body.uuid,
      created_at: new Date(),
      updated_at: new Date()
    });

    return NextResponse.json({ message: 'Produit créé avec succès', data: result }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur détaillée:', error);
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: Request) {
	const { id, ...data } = await request.json();
	const result = await db.update(product)
		.set(data)
		.where(eq(product.product_id, id));
	return NextResponse.json(result);
}

// DELETE - Supprimer un produit
export async function DELETE(request: Request) {
	const { id } = await request.json();
	const result = await db.delete(product).where(eq(product.product_id, id));
	return NextResponse.json(result);
}
