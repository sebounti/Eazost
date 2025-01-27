declare module "next-auth" {
    interface User {
        account_type?: string;
        stripe_customer_id?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        stripeCustomerId?: string;
        role?: string;
    }
}

import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/db";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { users, accounts, sessions, verificationTokens } from "@/db/authSchema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia"
});

export const { handlers: { GET, POST }, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens
    }),
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    pages: {
        signIn: "/login",
        error: "/error"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    account_type: "user"
                };
            }
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture?.data?.url,
                    account_type: "user"
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) return false;

            try {
                const existingUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, user.email))
                    .limit(1);

                if (existingUser.length > 0 && !existingUser[0].stripe_customer_id) {
                    const stripeCustomer = await stripe.customers.create({
                        email: user.email || '',
                        name: user.name || user.email || '',
                        metadata: {
                            provider: account?.provider || 'unknown',
                            accountType: user.account_type || "user"
                        }
                    } as Stripe.CustomerCreateParams);

                    await db
                        .update(users)
                        .set({
                            stripe_customer_id: stripeCustomer.id,
                        })
                        .where(eq(users.email, user.email));
                }
                return true;
            } catch (error) {
                console.error("Erreur dans signIn:", error);
                return false;
            }
        },

        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    stripeCustomerId: user.stripe_customer_id,
                    role: user.account_type
                };
            }
            return token;
        },

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    account_type: token.role,
                    stripe_customer_id: token.stripeCustomerId
                }
            };
        }
    }
});
