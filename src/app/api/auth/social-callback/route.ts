import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/authSchema";

//----- SOCIAL CALLBACK -----//
// Permet de gérer la connexion sociale //

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

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
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      // Créer l'utilisateur s'il n'existe pas
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
    }


    // Rediriger vers le dashboard avec les informations utilisateur
    const userData = {
      email: session.user.email,
      name: session.user.name,
      account_type: user?.account_type || "user"
    };

    return NextResponse.redirect(
      new URL(`/dashboard?userData=${encodeURIComponent(JSON.stringify(userData))}`, baseUrl)
    );

  } catch (error) {
    console.error("Erreur dans social-callback:", error);
    return NextResponse.redirect(new URL("/login?error=AuthError", baseUrl));
  }
}
