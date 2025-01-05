import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { stayInfo, accommodation } from '@/db/appSchema';
import { stayInfoSchema } from '@/lib/validations/StayInfoSchema';
import { sql } from 'drizzle-orm';

// GET pour récupérer toutes les info cards
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json({ message: 'User ID requis' }, { status: 400 });
		}

		// Récupérer d'abord les logements de l'utilisateur
		const accommodations = await db.select().from(accommodation)
			.where(sql`${accommodation.users_id} = ${userId}`);
		const accommodationIds = accommodations.map(acc => acc.accommodation_id);

		// Puis récupérer les stayInfo pour ces logements
		const stayInfoData = await db.select().from(stayInfo)
			.where(sql`${stayInfo.accommodation_id} IN ${accommodationIds}`);

		return NextResponse.json(stayInfoData);

	} catch (error) {
		console.error('Erreur lors de la récupération des cartes:', error);
		return NextResponse.json(
			{ message: 'Erreur serveur' },
			{ status: 500 }
		);
	}
}

// POST pour créer une nouvelle info card
export async function POST(request: Request) {
	try {
		const data = await request.json();
		console.log('📝 Données reçues:', data);

		// Vérifier les données avec le schéma
		const parsedData = stayInfoSchema.parse(data);
		console.log('✅ Données validées:', parsedData);

		// Créer la nouvelle info card
		const newInfoCard = await db.insert(stayInfo).values({
			accommodation_id: parsedData.accommodation_id,
			title: parsedData.title,
			description: parsedData.description,
			photo_url: parsedData.photo_url || null,
			category: parsedData.category,
			created_at: new Date(),
			updated_at: new Date()
		}).returning();

		console.log('✨ Nouvelle carte créée:', newInfoCard);

		return NextResponse.json(newInfoCard[0], { status: 201 });
	} catch (error) {
		console.error('❌ Erreur lors de la création de la carte:', error);
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: error.message },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: 'Erreur serveur' },
			{ status: 500 }
		);
	}
}

// DELETE pour supprimer une info card
export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const cardId = searchParams.get('cardId');

		if (!cardId) {
			return NextResponse.json({ message: 'Card ID requis' }, { status: 400 });
		}

		await db.delete(stayInfo)
			.where(sql`${stayInfo.stayInfo_id} = ${cardId}`);

		return NextResponse.json({ message: 'Carte supprimée avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression:', error);
		return NextResponse.json(
			{ message: 'Erreur serveur' },
			{ status: 500 }
		);
	}
}
