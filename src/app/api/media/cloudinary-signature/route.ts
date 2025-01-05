import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

export async function POST() {
  try {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Clé API Cloudinary manquante');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Créez l'objet params avec tous les paramètres nécessaires
    const params = {
      timestamp,
      folder: 'properties',
    };

    // Générez la signature avec tous les paramètres
    const signature = cloudinary.v2.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );


    console.log("String to sign :", params);
    console.log("Signature générée :", signature);

    return NextResponse.json({
      ...params,
      signature
    });
  } catch (error: any) {
    console.error("Erreur lors de la génération de la signature :", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
