//	api/users/[id]/profile/route.ts


import { db } from "@/db/db";
import { usersInfo } from "@/db/appSchema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { UsersInfoSchema } from "@/validation/UsersInfoSchema";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 GET - ID reçu:', params.id);

        // Récupérer les informations de base de l'utilisateur
        const userProfile = await db
            .select({
                users_id: usersInfo.users_id,
                first_name: usersInfo.first_name,
                last_name: usersInfo.last_name,
                date_of_birth: usersInfo.date_of_birth,
                phone_number: usersInfo.phone_number,
                address_line1: usersInfo.address_line1,
                address_line2: usersInfo.address_line2,
                city: usersInfo.city,
                zipcode: usersInfo.zipcode,
                country: usersInfo.country,
                photo_url: usersInfo.photo_url
            })
            .from(usersInfo)
            .where(eq(usersInfo.users_id, params.id))
            .limit(1)
            .then(rows => rows[0]);

        console.log('📦 Profil trouvé:', userProfile);

        if (!userProfile) {
            return NextResponse.json(
                { error: "Profil non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}


//----- POST -----//
// Route pour créer un profil //
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('📝 POST - Création du profil pour ID:', params.id);
        const data = await request.json();


		// verification zod pour les données
		const zodValidation = UsersInfoSchema.safeParse(data);
		if (!zodValidation.success) {
			return NextResponse.json({ error: "Données invalides" }, { status: 400 });
		}

        // Créer un nouveau profil
        const newProfile = {
            users_id: params.id,
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
            phone_number: data.phone_number,
            address_line1: data.address_line1,
            address_line2: data.address_line2 || null,
            city: data.city,
            zipcode: data.zipcode,
            country: data.country,
            created_at: new Date()
        };

		// Créer le profil
        await db.insert(usersInfo).values(newProfile);
        console.log('✅ Profil créé avec succès');

        return NextResponse.json(newProfile, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur lors de la création du profil:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création du profil" },
            { status: 500 }
        );
    }
}


//----- PUT -----//
// Route pour mettre à jour un profil //
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('📝 PUT/CREATE - Traitement pour ID:', params.id);
        const data = await request.json();

        // Vérifier si le profil existe
        const existingProfile = await db
            .select()
            .from(usersInfo)
            .where(eq(usersInfo.users_id, params.id))
            .limit(1);

        const profileData = {
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
            phone_number: data.phone_number,
            address_line1: data.address_line1,
            address_line2: data.address_line2 || null,
            city: data.city,
            zipcode: data.zipcode,
            country: data.country
        };

        if (!existingProfile[0]) {
            // Créer un nouveau profil
            console.log('🆕 Création d\'un nouveau profil');
            await db.insert(usersInfo).values({
                ...profileData,
                users_id: params.id,
                created_at: new Date()
            });
            console.log('✅ Nouveau profil créé avec succès');
            return NextResponse.json(profileData, { status: 201 });
        }

        // Mettre à jour le profil existant
        console.log('📝 Mise à jour du profil existant');
        await db.update(usersInfo)
            .set(profileData)
            .where(eq(usersInfo.users_id, params.id));

        console.log('✅ Profil mis à jour avec succès');
        return NextResponse.json(profileData);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour/création du profil:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour/création du profil" },
            { status: 500 }
        );
    }
}
