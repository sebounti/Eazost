import { NextResponse } from "next/server";
import { eq } from 'drizzle-orm';  // Drizzle ORM pour la requête conditionnelle
import db from '@/db/db';  // Instance de ta base de données
import { stayInfo } from '@/db/appSchema';  // Schéma de ta table dans la base de données
import { CardSchema } from '@/validation/CardSchema';  // Schéma de validation Zod
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET as string;

async function getUserFromToken(req: Request) {
  const cookieHeader = req.headers.get('cookie');

  if (!cookieHeader) {
    throw new Error("No cookies found, token missing.");
  }

  // Extraire le token JWT depuis le cookie
  const token = cookieHeader
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    throw new Error("Token not found in cookies.");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return (decoded as { id: string }).id; // On suppose que le token contient l'ID de l'utilisateur
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Failed to authenticate token");
  }
}

// Gérer la requête GET pour récupérer une carte spécifique par ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {

	// Vérifier l'authentification de l'utilisateur
    const userId = await getUserFromToken(req);
    console.log('Utilisateur authentifié avec ID:', userId);

    const cardId = parseInt(params.id);  // Convertir l'ID en nombre
    const card = await db.select().from(stayInfo).where(eq(stayInfo.stay_info_id, cardId)).limit(1);

    if (card.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching card" }, { status: 500 });
  }
}

// Gérer la requête PUT pour mettre à jour une carte
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {

	// Vérifier l'authentification de l'utilisateur
	const userId = await getUserFromToken(req);
	console.log('Utilisateur authentifié avec ID:', userId);

    const cardId = parseInt(params.id);
    const body = await req.json();

    // Valider les données avec Zod
    const parsedData = CardSchema.parse(body);

    // Vérifier si la carte existe
    const existingCard = await db.select().from(stayInfo).where(eq(stayInfo.stay_info_id, cardId)).limit(1);
    if (existingCard.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Mettre à jour la carte
    await db.update(stayInfo)
      .set(parsedData)
      .where(eq(stayInfo.stay_info_id, cardId));

    // Fetch the updated card
    const updatedCard = await db.select().from(stayInfo).where(eq(stayInfo.stay_info_id, cardId)).limit(1);

    return NextResponse.json(updatedCard[0], { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Error updating card";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// Gérer la requête DELETE pour supprimer une carte
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {

	// Vérifier l'authentification de l'utilisateur
    const userId = await getUserFromToken(req);
    console.log('Utilisateur authentifié avec ID:', userId);

    const cardId = parseInt(params.id);

    // Vérifier si la carte existe
    const existingCard = await db.select().from(stayInfo).where(eq(stayInfo.stay_info_id, cardId)).limit(1);
    if (existingCard.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Supprimer la carte
    await db.delete(stayInfo).where(eq(stayInfo.stay_info_id, cardId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting card" }, { status: 500 });
  }
}
