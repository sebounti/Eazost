import { db } from '@/db/db';
import { NextResponse } from 'next/server';


// GET - Récupérer les données d'un shop
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const accommodationId = searchParams.get('accommodationId');

	if (!accommodationId) {
		return NextResponse.json(
			{ message: 'AccommodationId manquant' },
			{ status: 400 }
		);
	}

	// on récupère l'id du shop en fonction de l'id du logement
	const shopId = Number(accommodationId);

	// Récupérer les produits associés au shop
	const products = await db.query.product.findMany({
		where: (product, { eq }) => eq(product.shop_id, shopId),
	});

	// on récupère les métriques du shop
	const shopWithMetrics = {
		shop_id: shopId,
		accommodation_id: Number(accommodationId),
		total_revenue: await calculateTotalRevenue(shopId),
		total_orders: await countOrders(shopId),
		average_order: await calculateAverageOrder(shopId),
		monthly_sales: await getMonthlyStats(shopId),
	};

	return NextResponse.json({
		message: 'Données récupérées avec succès',
		data: {
			shop: shopWithMetrics,
			products: products,
		},
	});
}


// Fonctions utilitaires pour les métriques
async function calculateTotalRevenue(shopId: number) {

	return 0;
}

async function countOrders(shopId: number) {
	// TODO: Implémenter le comptage des commandes
	return 0;
}

async function calculateAverageOrder(shopId: number) {
	// TODO: Implémenter le calcul de la moyenne des commandes
	return 0;
}

async function getMonthlyStats(shopId: number) {
	// TODO: Implémenter les statistiques mensuelles
	return { jan: 0, feb: 0 };
}
