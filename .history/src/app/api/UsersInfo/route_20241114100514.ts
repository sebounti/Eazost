import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';
import { usersInfo } from '@/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { UsersInfoSchema } from '@/validation/UsersInfoSchema';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) throw new Error('JWT_SECRET is not defined in the environment');

async function getUserFromToken(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) throw new Error('Token non trouvé');
  const decoded = jwt.verify(token, secretKey as string) as { userId: number };
  return decoded.userId;
}

async function getUserIfExists(userId: number) {
  const userExists = await db.select().from(usersInfo).where(eq(usersInfo.users_id, userId)).limit(1);
  return userExists.length > 0 ? userExists[0] : null;
}

export async function GET(request: NextRequest) {
  try {
    console.log("Requête reçue pour /api/UsersInfo");
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const user = await db.select().from(usersInfo).where(eq(usersInfo.users_id, userId)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const userInfo = user[0];
    if (!userInfo.first_name || !userInfo.last_name) {
      return NextResponse.json({ error: "Profil incomplet", completeProfile: true }, { status: 200 });
    }

    const userData = {
      ...user[0],
      date_of_birth: user[0].date_of_birth ? user[0].date_of_birth.toISOString().split('T')[0] : null,
    };

    const validatedUser = UsersInfoSchema.parse(userData);
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors.map(e => e.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    const formData = await request.json();
    const dataToValidate = { ...formData, users_id: userId };
    UsersInfoSchema.parse(dataToValidate);

    const userExists = await db.select().from(usersInfo).where(eq(usersInfo.users_id, userId)).limit(1);
    if (userExists.length === 0) {
      await db.insert(usersInfo).values(dataToValidate);
      return NextResponse.json({ message: 'Profil créé avec succès' }, { status: 201 });
    }

    return NextResponse.json({ error: 'Le profil existe déjà' }, { status: 409 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    const formData = await request.json();
    UsersInfoSchema.parse(formData);

    const userExists = await getUserIfExists(userId);
    if (!userExists) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const updateData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
      address_line1: formData.address_line1,
      address_line2: formData.address_line2,
      city: formData.city,
      zipcode: formData.zipcode,
      country: formData.country,
      phone_number: formData.phone_number,
	  profile_image_url: formData.profile_image_url,
    };

    if (formData.profile_image_url) {
      updateData.profile_image_url = formData.profile_image_url;
    }

    await db.update(usersInfo).set(updateData).where(eq(usersInfo.users_id, userId));
    return NextResponse.json({ message: 'Profil mis à jour avec succès', user: updateData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);

    const userExists = await getUserIfExists(userId);
    if (!userExists) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    await db.delete(usersInfo).where(eq(usersInfo.users_id, userId));
    return NextResponse.json({ message: 'Profil supprimé avec succès' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
