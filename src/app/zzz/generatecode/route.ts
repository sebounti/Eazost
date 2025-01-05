import NextAuth, { DefaultSession } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db/db"
import Stripe from "stripe"
import { eq } from "drizzle-orm"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { users, accounts, sessions, usersVerification } from "@/db/authSchema"
import { NextRequest } from "next/server";

console.log("🚀 Starting server...");

// Déclaration de type
declare module "next-auth" {
    interface User {
        stripe_customer_id?: string | null;
        account_type?: string;
    }

    interface Session {
        user: DefaultSession["user"] & {
            account_type?: string;
            stripe_customer_id?: string | null;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        stripeCustomerId?: string | null;
    }
}

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2024-12-18.acacia'
});

// Fonction pour logger les requêtes
async function logRequest(req: NextRequest) {
    const body = req.headers.get('content-type')?.includes('application/json')
	? await req.json()
	: await req.text();
    console.log("📥 Requête entrante:", {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers),
        body: body
    });
}

const handler = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: usersVerification
	}),
	secret: process.env.NEXTAUTH_SECRET,
	debug: true,
	pages: {
		signIn: "/login",
		error: "/error"
	},
	logger: {
		error(code, ...message) {
			console.error("🔴 [Erreur Auth]", { code, message });
		},
		warn(code, ...message) {
			console.warn("🟡 [Attention Auth]", { code, message });
		},
		debug(code, ...message) {
			console.log("🔵 [Debug Auth]", { code, message });
		}
	},
	events: {
		signIn: ({ user, account, isNewUser }) => {
			console.log('📝 Événement signIn :', JSON.stringify({ user, account, isNewUser }, null, 2));
		},
		signOut: ({ session, token }) => {
			console.log('📝 Événement signOut :', JSON.stringify({ session, token }, null, 2));
		},
		createUser: ({ user }) => {
			console.log('📝 Événement createUser :', JSON.stringify({ user }, null, 2));
		}
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
				}
			},
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					account_type: 'user'
				};
			}
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
		}),
	],

	callbacks: {
		// 1. Création du client Stripe
		async signIn({ user, account }) {
			console.log('🔑 Données complètes reçues:', {
				user: JSON.stringify(user),
				account: JSON.stringify(account)
			});

			if (!account) {
				console.log('❌ Échec : Aucun compte fourni');
				return false;
			}

			if (!user.email) {
				console.log('❌ Échec : Email utilisateur manquant');
				return false;
			}

			try {
				console.log('🔍 Recherche utilisateur:', user.email);
				const existingUser = await db
					.select()
					.from(users)
					.where(eq(users.email, user.email))
					.limit(1);

				console.log('📊 Utilisateur trouvé:', JSON.stringify(existingUser[0]));

				// Si l'utilisateur existe mais n'a pas de Stripe ID
				if (existingUser.length > 0) {
					if (!existingUser[0].stripe_customer_id) {
						console.log('💳 Création compte Stripe nécessaire');
						try {
							const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
								apiVersion: '2024-12-18.acacia'
							});

							const stripeCustomer = await stripe.customers.create({
								email: user.email!,
								name: user.name ?? user.email!,
								metadata: {
									provider: account.provider,
									accountType: user.account_type ?? 'user'
								}
							});
							console.log('✅ Compte Stripe créé avec succès :', stripeCustomer.id);

							console.log('📝 Mise à jour de la base de données avec l\'ID Stripe...');
							await db
								.update(users)
								.set({
									stripe_customer_id: stripeCustomer.id,
								})
								.where(eq(users.email, user.email));
							console.log('✅ Base de données mise à jour avec succès');
						} catch (stripeError: unknown) {
							if (stripeError instanceof Stripe.errors.StripeError) {
								console.error('❌ Erreur Stripe :', {
									error: stripeError,
									message: stripeError.message,
									type: stripeError.type
								});
							}
							return false;
						}
					}
				}

				console.log('✅ Processus de signIn terminé avec succès');
				return true;
			} catch (error: any) {
				console.error('❌ Erreur générale dans signIn :', {
					error,
					message: error.message,
					stack: error.stack
				});
				return false;
			}
		},


		// 2. Ajouter des données dans le JWT
		async jwt({ token, user }) {
			console.log('🔒 Génération du JWT');
			if (user) {
				console.log('👤 Données utilisateur ajoutées au token:', {
					stripeCustomerId: user.stripe_customer_id,
					role: user.account_type
				});
				return {
					...token,
					stripeCustomerId: user.stripe_customer_id,
					role: user.account_type
				};
			}
			console.log('🔑 Token retourné sans modification');
			return token;
		},

		// 3. Ajouter des données dans la session
		async session({ session, token }) {
			console.log('📍 Création de la session avec token:', token);
			return {
				...session,
				user: {
					...session.user,
					account_type: token.role,
				}
			};
		},
	}
})

// Handler principal
export async function GET(request: NextRequest) {
    return handler(request);
}

export async function POST(request: NextRequest) {
    return handler(request);
}

// Configuration des routes
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
