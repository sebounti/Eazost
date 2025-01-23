import { db } from '@/db/db';
import { NextResponse } from 'next/server';
import { stayInfo } from '@/db/appSchema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { accommodation } from '@/db/appSchema';

//----- route stayInfo -----//
// route pour les informations de séjour //

//----- GET -----//
// Route pour récupérer les infos //
export async function GET(request: NextRequest) {
	const userId = request.nextUrl.searchParams.get('userId');

	console.log('GET /api/stayInfo - userId:', userId);

	if (!userId) {
		return NextResponse.json(
			{ message: 'UserId manquant' },
			{ status: 400 }
		);
	}

	try {
		// Jointure pour récupérer les stayInfo liés aux logements de l'utilisateur
		const stayInfos = await db
			.select({
				stay_info_id: stayInfo.stay_info_id,
				title: stayInfo.title,
				description: stayInfo.description,
				category: stayInfo.category,
				photo_url: stayInfo.photo_url,
				accommodation_id: stayInfo.accommodation_id,
				created_at: stayInfo.created_at,
				updated_at: stayInfo.updated_at
			})
			.from(stayInfo)
			.innerJoin(accommodation, eq(stayInfo.accommodation_id, accommodation.accommodation_id))
			.where(eq(accommodation.users_id, userId));

		return NextResponse.json(stayInfos);
	} catch (error) {
		console.error('Erreur:', error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}


//----- POST -----//
// Route pour créer une info de séjour //
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

//----- PUT -----//
// Route pour mettre à jour une info de séjour //
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

//----- DELETE -----//
// Route pour supprimer une info de séjour //
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
