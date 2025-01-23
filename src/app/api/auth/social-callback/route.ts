import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import {db} from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/authSchema";
import { generateAccessToken, generateRefreshToken } from "@/app/api/services/tokenService";

//----- SOCIAL CALLBACK -----//
// Permet de gérer la connexion sociale //


//----- GET -----//
// Route pour gérer la connexion sociale //
export async function GET(request: Request) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login?error=NoEmail", baseUrl));
    }

    // Vérifier si l'utilisateur existe déjà
    await db.insert(users).values({
      id: crypto.randomUUID(),
      uuid: crypto.randomUUID(),
      email: session.user.email,
      account_type: "user",
      user_name: session.user.name || "User",
      password: "",
      created_at: new Date(),
      updated_at: new Date(),
    });

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=UserNotFound", baseUrl));
    }

    // Générer les tokens de votre système
    const accessToken = generateAccessToken(user.id, user.account_type);
    const refreshToken = generateRefreshToken(user.id);

    // Créer la réponse avec redirection
    const userData = {
      user_id: user.id,
      email: user.email,
      account_type: user.account_type,
      name: user.name
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

	// Définir les cookies de refresh token
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
