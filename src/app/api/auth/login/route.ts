import { generateAccessToken, generateRefreshToken, getUserFromToken } from '@/app/api/services/allTokenService';
import db from '@/db/db';
import { eq } from 'drizzle-orm/expressions';
import { users, usersSession } from '@/db/appSchema'
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server'; // Utilisation des objets Next.js
import { logUserActivity } from '@/utils/logging'; // Importer depuis le bon chemin
import { ChangePasswordSchema } from '@/validation/ChangePasswordSchema'; // Importation du schéma de validation
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { setAuthCookies } from '@/app/api/services/allTokenService';
import rateLimiter from '@/utils/rateLimiter';
import { TOKEN_CONFIG } from '@/app/api/services/allTokenService';
import crypto from 'crypto';


// Route de connexion pour les utilisateurs //
console.log('setAuthCookies:', typeof setAuthCookies);

export async function POST(request: NextRequest) {

  // Appliquer le rate limiter (100 requêtes/15min)
  const limitResult = rateLimiter(100)(request);
  if (limitResult) {
	console.log("🚫 Limite de requêtes dépassée");
    return limitResult; // Retourne la réponse 429 si la limite est dépassée
  }

  try {
	// Définition du schéma
	console.log('📋 Validation des données de connexion');
	const LoginSchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
		});

    // Récupérer les données de connexion (email, mot de passe)
    const { email, password } = LoginSchema.parse(await request.json());
	console.log('✅ Données validées :', { email });


    // Vérifier si l'utilisateur existe dans la base de données
	console.log('🔍 Vérification de l’utilisateur en base');
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
	console.log('✅ Utilisateur trouvé :', user[0]);
    if (!user[0]) {
		return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
	  }

	console.log('🔍 Vérification du mot de passe');
    // Comparer le mot de passe envoyé avec celui haché dans la base de données
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
		console.log('❌ Mot de passe incorrect');
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }
	console.log('✅ Mot de passe valide');


    // Si le mot de passe est valide, générer un token JWT avec userId
	console.log('🔍 Génération du token d’accès');
    const accessToken = generateAccessToken(user[0].users_id, user[0].account_type);
	console.log('🔍 Génération du token de rafraîchissement');
    const refreshToken = generateRefreshToken(user[0].users_id, user[0].account_type);
	console.log('✅ Token de rafraîchissement généré :', refreshToken);




	// Récupérer l'adresse IP et l'agent utilisateur
	console.log('🔍 Récupération de l\'adresse IP et de l\'agent utilisateur');
	const ipAddress = request.headers.get('x-forwarded-for') ||
	request.headers.get('x-real-ip') ||
	request.headers.get('remote-addr') || ''; // Si aucune adresse IP trouvée
	const userAgent = request.headers.get('user-agent') || '';

	// Hachage du refresh token
	const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
	console.log('🔒 Token haché :', hashedToken);


	// Insertion du token dans la base de données
	const generatedUuid = uuidv4();  // Générer l'UUID une seule fois
	console.log('🎫 UUID généré :', generatedUuid);

	await db.insert(usersSession).values({
			users_id: user[0].users_id,
			token: hashedToken,
			uuid: generatedUuid,
			expired_at: new Date(Date.now() + TOKEN_CONFIG.DURATION.REFRESH_COOKIE * 1000),
			user_agent: userAgent,
			ip_address: ipAddress,
		});

		console.log('🔍 Récupération de la session en base', { uuid: uuidv4()});

		// Récupérer la session en base
		const storedSession = await db.select().from(usersSession)
		.where(eq(usersSession.users_id, user[0].users_id))
		.limit(1);

console.log("📄 Session en base après insertion :", storedSession);


		const sessionData = {
			users_id: user[0].users_id,
			token: refreshToken,
			uuid: generatedUuid,
			expired_at: new Date(Date.now() + TOKEN_CONFIG.DURATION.REFRESH_COOKIE * 1000),
			user_agent: userAgent,
			ip_address: ipAddress,
		};

		console.log('✅ Session utilisateur à ajouter :', sessionData);

		await db.insert(usersSession).values(sessionData);
		console.log("✅ Session utilisateur ajoutée :", sessionData);


	// Créer la réponse d'abord
	const response = NextResponse.json({
		message: 'Connexion réussie',
		user: {
			users_id: user[0].users_id,
			account_type: user[0].account_type,
			email: user[0].email,
			isAuthenticated: true
		},
		token: accessToken
	});
	console.log('✅ Réponse créée :', response);
	setAuthCookies(response, accessToken, refreshToken);
    console.log('✅ Cookies configurés', response.cookies);

	console.log("Appel de logUserActivity avec :", { accessToken, ipAddress, userAgent });

	// Appeler la fonction logUserActivity avec les bons arguments
    logUserActivity(accessToken, ipAddress, userAgent);
	console.log("logUserActivity a été appelée");

	console.log("Ajout du cookie dans les en-têtes de la réponse");

	console.log("Token généré pour l'utilisateur:", user[0].users_id);

    console.log('📤 Réponse envoyée avec succès');
	return response;


  } catch (error) {
	console.error("Erreur lors de la connexion:", error); // Log l'erreur complète
	return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}



// Route GET pour obtenir les informations de l'utilisateur connecté //

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
