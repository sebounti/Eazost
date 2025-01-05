import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/services/tokenService';

export async function GET(req: NextRequest) {
    // Récupérer le token depuis les paramètres de l'URL
    const token = req.nextUrl.searchParams.get('token');
    console.log('Token reçu dans la route:', token);  // Pour vérifier la récupération du token

    if (!token) {
        // Si le token est absent, renvoyer une erreur
        return NextResponse.json({ success: false, message: 'Token invalide ou expiré' }, { status: 400 });
    }

    // Vérifier le token en utilisant la fonction verifyToken
    const verificationResult = await verifyToken(token);
	log

    // Envoyer la réponse en fonction du résultat de la vérification
    if (verificationResult.success) {
        return NextResponse.json({ success: true, message: 'Token vérifié avec succès' }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, message: verificationResult.message }, { status: 401 });
    }
}
