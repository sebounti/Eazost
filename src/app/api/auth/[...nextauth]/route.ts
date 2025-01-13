import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/authSchema";
import bcrypt from "bcrypt";

// Type pour l'utilisateur
type UserSession = {
    id: string;
    email: string;
    name: string;
    account_type?: string;
    image?: string;
}

type user = {
    id: string;
    email: string;
    name: string;
    account_type?: string;
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: UserSession & DefaultSession["user"]
    }
    interface User {
        account_type?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends UserSession {}
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                console.log("👉 Début authorize avec email:", credentials?.email);
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log("❌ Credentials manquants");
                        return null;
                    }

                    const user = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, credentials.email))
                        .limit(1)
                        .then(rows => rows[0]);

                    console.log("🔍 Utilisateur trouvé:", user);

                    if (!user?.password) {
                        console.log("❌ Pas de mot de passe pour l'utilisateur");
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    console.log("🔐 Mot de passe correct:", passwordMatch);

                    if (!passwordMatch) {
                        console.log("❌ Mot de passe incorrect");
                        return null;
                    }

                    const userToReturn = {
                        id: user.id,
                        email: user.email,
                        name: user.name || user.email,
                        account_type: user.account_type
                    };
                    console.log("✅ Retour utilisateur:", userToReturn);
                    return userToReturn;
                } catch (error) {
                    console.error("🔴 Erreur d'authentification:", error);
                    return null;
                }
            }
        }),
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
        async signIn({ user, account }) {
            console.log("🔑 SignIn callback:", { user, account });
            return true;
        },
        async jwt({ token, user }) {
            console.log('🎫 JWT Input:', { token, user });
            if (user) {
                token.id = user.id;
                token.email = user.email || '';
                token.name = user.name || '';
                token.account_type = user.account_type;
            }
            console.log('🎫 JWT Output:', token);
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.email = token.email || '';
                session.user.name = token.name || '';
                session.user.account_type = token.account_type;
                session.user.image = token.image;
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
