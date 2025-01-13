import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { stayInfo } from "@/db/appSchema";
import { eq } from "drizzle-orm";
import { pool } from "@/db/db";


// Gestion de toutes les requêtes pour /api/infoCard/[id]
// GET pour récupérer une info card
export async function GET(request: Request, { params }: { params: { id: string } }) {
	const connection = await pool.getConnection();
	try {
		const infoCard = await db
			.select()
			.from(stayInfo)
			.where(eq(stayInfo.stay_info_id, parseInt(params.id)))
			.then((results) => results[0]);
		return NextResponse.json(infoCard);
	} finally {
		connection.release();
	}
}


// PUT pour mettre à jour une info card
export async function PUT(request: Request, { params }: { params: { id: string } }) {
	const connection = await pool.getConnection();
	try {
		const id = parseInt(params.id);
		const data = await request.json();
		await db.update(stayInfo).set(data).where(eq(stayInfo.stay_info_id, id));
		return NextResponse.json({ message: 'Info card updated' });
	} finally {
		connection.release();
	}
}


// DELETE pour supprimer une info card
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const connection = await pool.getConnection();
	try {
		await db.delete(stayInfo).where(eq(stayInfo.stay_info_id, parseInt(params.id)));
		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response('Erreur lors de la suppression', { status: 500 });
	} finally {
		connection.release();
	}
}
