import bcrypt from 'bcrypt';
import { generateToken, getUserFromToken } from '; // Importation depuis tokenService.ts
import db from '@/db/db';
import { eq } from 'drizzle-orm/expressions';
import { users } from '@/db/schema'
import dotenv from 'dotenv';
import { insertSession } from '@/lib/utils/sessionService';
import { NextRequest, NextResponse } from 'next/server'; // Utilisation des objets Next.js
import { logUserActivity } from '@/utils/logging'; // Importer depuis le bon chemin
import { ChangePasswordSchema } from '@/validation/ChangePasswordSchema'; // Importation du schéma de validation
import { z } from 'zod'; // Importation de Zod pour la validation

dotenv.config();

// Route de connexion pour les utilisateurs
export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de connexion (email, mot de passe)
    const { email, password } = await request.json();

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Comparer le mot de passe envoyé avec celui haché dans la base de données
    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    // Si le mot de passe est valide, générer un token JWT avec userId
    const token = generateToken(user[0].users_id, user[0].account_type);

    // Récupérer l'adresse IP et l'agent utilisateur
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      request.headers.get('remote-addr') ||
                      ''; // Si aucune adresse IP trouvée

    const userAgent = request.headers.get('user-agent') || '';

    // Insérer la session utilisateur avec l'IP et l'agent utilisateur
	await insertSession(user[0].users_id, token, ipAddress, userAgent);

	console.log("Appel de logUserActivity avec :", { token, ipAddress, userAgent });

	console.log("Appel de logUserActivity avec :", { token, ipAddress, userAgent });
	// Appeler la fonction logUserActivity avec les bons arguments
    logUserActivity(token, ipAddress, userAgent);
	console.log("logUserActivity a été appelée");

    // Créer un cookie sécurisé avec le token JWT
    const response = NextResponse.json({
      message: 'Connexion réussie',
      account_type: user[0].account_type,
	  users_id: user[0].users_id,        // Ajoute l'ID de l'utilisateur
    }, { status: 200 });

	console.log("Ajout du cookie dans les en-têtes de la réponse");
	console.log(" token:", token);
    // Ajouter le cookie dans les en-têtes de la réponse
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600, // 1 heure
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Route GET pour obtenir les informations de l'utilisateur connecté
export async function GET(request: NextRequest) {
	try {
	  const { userId } = await getUserFromToken(request); // Récupérer uniquement l'ID de l'utilisateur depuis le token

	  // Assurez-vous que `userId` est de type `number` avant d'effectuer la requête
	  if (typeof userId !== 'number') {
		return NextResponse.json({ error: "User ID invalide" }, { status: 400 });
	  }

	  const user = await db
		.select({ email: users.email })
		.from(users)
		.where(eq(users.users_id, userId))
		.limit(1);

	  if (!user || user.length === 0) {
		return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
	  }

	  return NextResponse.json({ email: user[0].email }, { status: 200 });
	} catch (error) {
	  return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
  }



// route PATCH pour changer le mot de passe de l'utilisateur
  export async function PATCH(request: NextRequest) {
	try {
	  // Extraire et valider les données de la requête
	  const body = await request.json();
	  const { oldPassword, newPassword } = ChangePasswordSchema.parse(body);

	  // Récupérer l'utilisateur authentifié
	  const { userId } = await getUserFromToken(request);

	  if (typeof userId !== 'number') {
		return NextResponse.json({ error: "User ID invalide" }, { status: 400 });
	  }

	  // Rechercher l'utilisateur dans la base de données
	  const user = await db.select().from(users).where(eq(users.users_id, userId)).limit(1);

	  if (!user || user.length === 0) {
		return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
	  }

	  // Vérifier l'ancien mot de passe
	  const validPassword = await bcrypt.compare(oldPassword, user[0].password);
	  if (!validPassword) {
		return NextResponse.json({ error: "Ancien mot de passe incorrect" }, { status: 401 });
	  }

	  // Hacher et mettre à jour le nouveau mot de passe
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
	  await db.update(users).set({ password: hashedPassword }).where(eq(users.users_id, userId));

	  return NextResponse.json({ message: "Mot de passe mis à jour avec succès" }, { status: 200 });
	} catch (error) {
	  // Gérer les erreurs de validation Zod
	  if (error instanceof z.ZodError) {
		return NextResponse.json({ error: (error as z.ZodError).errors.map((e: { message: string; }) => e.message).join(", ") }, { status: 400 });
	  }
	  return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
  }
