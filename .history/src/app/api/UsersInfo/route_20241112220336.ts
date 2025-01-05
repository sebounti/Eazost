import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';
import { usersInfo } from '@/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { UsersInfoSchema } from '@/validation/UsersInfoSchema';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

async function getUserFromToken(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) throw new Error('Token non trouvé');
  const decoded = jwt.verify(token, secretKey as string) as { userId: number };
  return decoded.userId;
}

export async function GET(request: NextRequest) {
  try {
    console.log("Requête reçue pour /api/UsersInfo");  // Log pour vérifier la requête

    // Utilisation de la fonction pour extraire l'ID utilisateur
    const userId = await getUserFromToken(request);
    console.log("ID utilisateur extrait:", userId);  // Log pour vérifier l'ID utilisateur
	
    // Requête à la base de données pour récupérer les informations utilisateur
    const user = await db.select().from(usersInfo).where(eq(usersInfo.users_id, userId)).limit(1);

    // Vérifie si l'utilisateur est trouvé
    if (user.length === 0) {
      console.log("Aucun utilisateur trouvé avec cet ID");
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

	const userInfo = user[0];
	if (!userInfo.first_name || !userInfo.last_name) {
  		return NextResponse.json({ error: "Profil incomplet", completeProfile: true }, { status: 200 });
		}

	// Convertir la date au format ISO pour le front-end
    const userData = {
		...user[0],
		date_of_birth: user[0].date_of_birth ? user[0].date_of_birth.toISOString().split('T')[0] : null,
	  };

	// Validation et formatage avec Zod
    const validatedUser = UsersInfoSchema.parse(userData);


    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
	if (error instanceof z.ZodError) {
		console.error("Erreur de validation:", error.errors);
		return NextResponse.json({ error: error.errors }, { status: 400 });
	}

    console.error("Erreur lors de la récupération des informations utilisateur:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}


// **POST** : Créer un nouveau profil utilisateur

export async function POST(request: NextRequest) {
	try {
	  const userId = await getUserFromToken(request);

	  const formData = await request.json();
	  const dataToValidate = { ...formData, users_id: userId };
	  UsersInfoSchema.parse(dataToValidate);

	  const userExists = await db.select().from(usersInfo).where(eq(usersInfo.users_id, userId)).limit(1);
	  if (userExists.length === 0) {
		await db.insert(usersInfo).values(dataToValidate);
		return NextResponse.json({ message: 'Profil créé avec succès' }, { status: 201 });
	  }

	  return NextResponse.json({ error: 'Le profil existe déjà' }, { status: 400 });
	} catch (error) {
	  return NextResponse.json({ error: (error as Error).message }, { status: 400 });
	}
  }


  // **PUT** : Mettre à jour les informations du profil utilisateur
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);

    const formData = await request.json();
    UsersInfoSchema.parse(formData);

    const userExists = await db.select().from(usersInfo).where(eq(usersInfo.users_id, userId)).limit(1);
    if (userExists.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
// Construction des données à mettre à jour, y compris profile_image_url si présent
const updateData: any = {
	first_name: formData.first_name,
	last_name: formData.last_name,
	date_of_birth: formData.date_of_birth,
	address_line1: formData.address_line1,
	address_line2: formData.address_line2,
	city: formData.city,
	zipcode: formData.zipcode,
	country: formData.country,
	phone_number: formData.phone_number,
  };

  // Ajoute profile_image_url uniquement s'il est présent dans formData
  if (formData.profile_image_url) {
	updateData.profile_image_url = formData.profile_image_url;
  }

  // Mise à jour des informations dans la base de données
  await db.update(usersInfo).set(updateData).where(eq(usersInfo.users_id, userId));

  return NextResponse.json({ message: 'Profil mis à jour avec succès' }, { status: 200 });
} catch (error) {
  return NextResponse.json({ error: (error as Error).message }, { status: 400 });
}
}


// **DELETE** : Supprimer le profil utilisateur
export async function DELETE(request: NextRequest) {
	try {
	  const userId = await getUserFromToken(request);

	  const userExists = await db.select().from(usersInfo).where(eq(usersInfo.users_id, userId)).limit(1);
	  if (userExists.length === 0) {
		return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
	  }

	  await db.delete(usersInfo).where(eq(usersInfo.users_id, userId));
	  return NextResponse.json({ message: 'Profil supprimé avec succès' }, { status: 200 });
	} catch (error) {
	  return NextResponse.json({ error: (error as Error).message }, { status: 400 });
	}
  }
