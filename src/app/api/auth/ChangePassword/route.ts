import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import rateLimiter from "@/utils/rateLimiter";
import db from "@/db/db";
import { users } from "@/db/appSchema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { ChangePasswordSchema } from "@/validation/ChangePasswordSchema";
import { getUserFromToken } from "@/app/api/services/allTokenService";

export async function PATCH(
  request: NextRequest,
): Promise<NextResponse> {
  const limitResult = rateLimiter(20)(request);
  if (limitResult) {
    return limitResult;
  }

  try {
    const body = await request.json();
    const validatedData = ChangePasswordSchema.parse(body);

    const { userId } = await getUserFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    const user = await db.select().from(users)
      .where(eq(users.users_id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
      validatedData.oldPassword,
      user[0].password
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Ancien mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (validatedData.oldPassword === validatedData.newPassword) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit être différent de l'ancien" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.users_id, userId));

    return NextResponse.json(
      { message: "Mot de passe mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message).join(", ") },
        { status: 400 }
      );
    }

    console.error("Erreur lors du changement de mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du mot de passe" },
      { status: 500 }
    );
  }
}
