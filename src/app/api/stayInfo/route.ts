import { db } from '@/db/db';
import { NextResponse } from 'next/server';
import { stayInfo } from '@/db/appSchema';
import { eq } from 'drizzle-orm';

// GET - Récupérer les infos
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get('userId');

	console.log('GET /api/stayInfo - userId:', userId);

	if (!userId) {
		return NextResponse.json(
			{ message: 'UserId manquant' },
			{ status: 400 }
		);
	}

	try {
		// D'abord, récupérer les logements de l'utilisateur
		console.log('Recherche des logements pour userId:', userId);
		const accommodations = await db.query.accommodation.findMany({
			where: (accommodation, { eq }) => eq(accommodation.users_id, userId)
		});

		console.log('Logements trouvés:', accommodations);

		if (!accommodations.length) {
			return NextResponse.json({
				message: 'Aucun logement trouvé',
				data: []
			});
		}

		// Ensuite, récupérer les stayInfo pour ces logements
		console.log('Recherche des stayInfo pour les logements:', accommodations.map(a => a.accommodation_id));
		const stayInfos = await db.query.stayInfo.findMany({
			where: (stayInfo, { inArray }) =>
				inArray(stayInfo.accommodation_id, accommodations.map(acc => acc.accommodation_id))
		});

		console.log('StayInfos trouvés:', stayInfos);

		return NextResponse.json({
			message: 'Données récupérées avec succès',
			data: stayInfos
		});
	} catch (error: any) {
		console.error('Erreur détaillée:', error);
		return NextResponse.json(
			{ message: 'Erreur serveur', error: error.message },
			{ status: 500 }
		);
	}
}


// POST - Créer une nouvelle info
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
	console.log('=== POST /api/stayInfo ===');

	try {
		// Log de la requête complète
		console.log('Headers:', Object.fromEntries(req.headers.entries()));
		const body = await req.json();
		console.log('Body:', body);

		// Validation des données
		if (!body.accommodation_id || !body.title || !body.description || !body.category) {
			console.log('Validation failed:', body);
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Tentative d'insertion
		const result = await db.insert(stayInfo).values({
			accommodation_id: body.accommodation_id,
			title: body.title,
			category: body.category,
			description: body.description,
			photo_url: body.photo_url || null,
			created_at: new Date(),
			updated_at: new Date()
		});

		console.log('Insert result:', result);

		return NextResponse.json({ success: true, data: result });

	} catch (error) {
		console.error('POST Error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
			{ status: 500 }
		);
	}
}

// PUT - Mettre à jour une info
export async function PUT(request: Request) {
	try {
		const { id, ...data } = await request.json();
		const result = await db.update(stayInfo)
			.set(data)
			.where(eq(stayInfo.stay_info_id, id));
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ message: 'Erreur mise à jour' }, { status: 500 });
	}
}

// DELETE - Supprimer une info
export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id) {
		return NextResponse.json({ message: 'ID manquant' }, { status: 400 });
	}

	try {
		await db.delete(stayInfo).where(eq(stayInfo.stay_info_id, parseInt(id)));
		return NextResponse.json({ message: 'Supprimé avec succès' });
	} catch (error) {
		return NextResponse.json({ message: 'Erreur suppression' }, { status: 500 });
	}
}
