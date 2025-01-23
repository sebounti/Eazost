import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { NextResponse } from "next/server";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/authSchema";
import bcrypt from "bcrypt";
import { z } from 'zod';
import { generateRefreshToken, generateAccessToken, setAuthCookies, saveSession, TOKEN_CONFIG } from "@/app/api/services/tokenService";

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

const credentialsSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
        .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial")
});

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
                    const validatedCredentials = credentialsSchema.parse(credentials);

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
                    prompt: "select_account"
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
                    const dbUser = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, user.email))
                        .limit(1)
                        .then(rows => rows[0]);

                    if (dbUser) {
                        // Stocker les infos utilisateur
                        user.id = dbUser.id;
                        user.account_type = dbUser.account_type;
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('🔴 Erreur dans signIn:', error);
                return false;
            }
        },

		// 2. JWT - Générer les tokens une seule fois
        async jwt({ token, user, trigger, session }) {
            console.log('🎫 JWT Callback - Début', {
                trigger,
                hasUser: !!user,
                tokenBefore: {
                    hasId: !!token.id,
                    hasAccessToken: !!token.accessToken,
                }
            });

            // Si on n'a pas de tokens mais qu'on a un ID, on les génère
            if (!token.accessToken && token.id) {
                console.log('🔄 Régénération des tokens pour:', token.id);

                const accessToken = generateAccessToken(token.id, token.account_type || 'user');
                const refreshToken = generateRefreshToken(token.id);

                token.accessToken = accessToken;
                token.refreshToken = refreshToken;

                await saveSession(token.id, refreshToken);
                console.log('💾 Nouveaux tokens sauvegardés');
            }

            // Si on a un nouvel utilisateur (signIn)
            if (trigger === "signIn" && user) {
                console.log('👤 Nouvel utilisateur:', user.id);

                const accessToken = generateAccessToken(user.id, user.account_type);
                const refreshToken = generateRefreshToken(user.id);

                token.id = user.id;
                token.account_type = user.account_type;
                token.accessToken = accessToken;
                token.refreshToken = refreshToken;

                await saveSession(user.id, refreshToken);
            }

            console.log('🎫 JWT Callback - Fin', {
                hasTokens: {
                    access: !!token.accessToken,
                    refresh: !!token.refreshToken
                }
            });

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
        }
    },
    pages: {
        signIn: '/login',
        error: '/error'
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
