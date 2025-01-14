"use server";

import { product } from "@/db/appSchema";

export async function fetchProducts(): Promise<typeof product.$inferSelect[]> {
    const response = await fetch(`${process.env.API_URL}/api/shop`, {
	cache: 'no-store'
});

if (!response.ok) {
	throw new Error('Erreur lors de la récupération des données');
}

const result = await response.json();
return result.data;
}

//ajout d'un produit
export async function addProduct(formData: FormData) {
    const response = await fetch(`${process.env.API_URL}/api/shop`, {
	method: 'POST',
	body: formData,
});
}

//mise à jour d'un produit
export async function updateProduct(id: number, formData: FormData) {
    const response = await fetch(`${process.env.API_URL}/api/shop?id=${id}`, {
	method: 'PUT',
	body: formData,
});
}

//suppression d'un produit
export async function deleteProduct(id: number) {
    const response = await fetch(`${process.env.API_URL}/api/shop?id=${id}`, {
	method: 'DELETE',
});
}
