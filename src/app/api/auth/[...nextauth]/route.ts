import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/authSchema";
import bcrypt from "bcrypt";
import { z } from 'zod';
import { CredentialsSchema } from "@/validation/loginSchema";
import { signOut } from 'next-auth/react';

//----- AUTH CONFIGURATION -----//
// Gere l'authentification et la gestion des sessions //




// Type pour l'utilisateur
type UserSession = {
    id: string;
    email: string;
    name: string;
    account_type?: string;
    image?: string;
}


// Type pour l'utilisateur
type User = {
    id: string;
    email: string;
    name: string;
    account_type?: string;
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: UserSession & DefaultSession["user"];
        accessToken?: string;
        refreshToken?: string;
    }
    interface User {
        account_type?: string;
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends UserSession {
        accessToken?: string;
        refreshToken?: string;
    }
}

// Options d'authentification
export const authOptions: NextAuthOptions = {
    providers: [

		// Provider Credentials
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                try {
                    // Validation
                    const validatedCredentials = CredentialsSchema.parse(credentials);

                    // Vérification utilisateur et mot de passe
                    const user = await verifyCredentials(validatedCredentials);

                    return user;
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        console.error('Validation error:', error.errors);
                        return null;
                    }
                    console.error('Authentication error:', error);
                    return null;
                }
            }
        }),

		// Provider Google
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                    response_type: "code"
                }
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    name: profile.name,
                    image: profile.picture,
                    account_type: "user"
                };
            }
        })
    ],


    callbacks: {
		// 1. SignIn - Juste vérifier l'utilisateur
        async signIn({ user, account }) {
			try {
				if (account?.type === "credentials" && user.email) {
					// Logique existante pour credentials
					const dbUser = await db
						.select()
						.from(users)
						.where(eq(users.email, user.email))
						.limit(1)
						.then(rows => rows[0]);

					if (dbUser) {
						console.log("🔄 utilisateur trouve :", dbUser.id);
						user.id = dbUser.id;
						user.account_type = dbUser.account_type;
						return true;
					} else {
						console.error("🔴 Connexion refusée : utilisateur non trouvé. merci de d'abord créer un compte");
						return false;
					}
				}

				// Si le provider est OAuth
				if (account?.type === "oauth" && user.email) {
					// Vérification pour OAuth : Ne pas créer de compte
					const dbUser = await db
						.select()
						.from(users)
						.where(eq(users.email, user.email))
						.limit(1)
						.then(rows => rows[0]);

					if (!dbUser) {
						console.error("🔴 Connexion refusée : utilisateur OAuth non trouvé. merci de d'abord créer un compte");
						return "/register";
					}

					// Utilisateur trouvé, associer l'ID et le type de compte
					console.log("🔄 utilisateur trouve :", dbUser.id);
					user.id = dbUser.id;
					user.account_type = dbUser.account_type;
					return true;
				}

				console.warn("🔴 Connexion refusée :", account?.type);
				return false; // Retourner false en cas d'erreur
			} catch (error) {
				console.error('❌ Erreur signIn:', error);
				return false; // Retourner false en cas d'erreur
			}
		},



		// callback de verification jwt
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.account_type = user.account_type;
			}
			return token;
		},


		// 3. Session - Transmettre les tokens à la session
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.account_type = token.account_type;
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
            }
            return session;
        },

		// redirection selon le type de compte
        async redirect({ url, baseUrl }) {
            const accountType = users?.account_type || 'user';
			if (url.includes('/api/auth/callback/google')) {
				return `${baseUrl}/${accountType}/dashboard`;
			}
			return url.startsWith(baseUrl) ? url : baseUrl;
		}
	},

    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 jours
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET
};


// Fonction pour vérifier les credential avec le mot de passe
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

async function verifyCredentials(credentials: { email: string; password: string }) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, credentials.email))
    .limit(1)
    .then(rows => rows[0]);

  if (!user?.password || !user.id) return null;

  // Vérification du mot de passe
  const passwordMatch = await bcrypt.compare(credentials.password, user.password);
  if (!passwordMatch) return null;

  return {
    id: user.id.toString(),
    email: user.email ?? '',
    name: user.name ?? user.email ?? '',
    account_type: user.account_type ?? 'user'
  };
}

const handleLogout = async () => {
  try {
    // D'abord appeler notre API pour nettoyer les cookies
    await fetch('/api/auth/logout', { method: 'POST' });
    // Ensuite utiliser signOut de NextAuth
    await signOut({ callbackUrl: '/login' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
