import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import db from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/appSchema";
import { generateAccessToken, generateRefreshToken } from "@/app/api/services/allTokenService";

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login?error=NoEmail", baseUrl));
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      // Créer l'utilisateur s'il n'existe pas
      const [newUser] = await db.insert(users).values({
        email: session.user.email,
        account_type: "user",
        first_name: session.user.name?.split(" ")[0] || "",
        last_name: session.user.name?.split(" ")[1] || "",
        password: "", // Pas de mot de passe pour les connexions sociales
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();
      user = newUser;
    }

    // Générer les tokens de votre système
    const accessToken = generateAccessToken(user.users_id.toString(), user.account_type);
    const refreshToken = generateRefreshToken(user.users_id.toString(), user.account_type);

    // Créer la réponse avec redirection
    const userData = {
      user_id: user.users_id,
      email: user.email,
      account_type: user.account_type,
      first_name: user.first_name,
      last_name: user.last_name
    };

    const response = NextResponse.redirect(
      new URL(`/dashboard?userData=${encodeURIComponent(JSON.stringify(userData))}`, baseUrl)
    );

    // Définir vos cookies d'authentification
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
    });

    // Cookie pour le frontend
    response.cookies.set("user", JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur dans social-callback:", error);
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/login?error=AuthError", baseUrl));
  }
}
