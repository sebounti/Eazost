"use server";

import { accommodation } from "@/db/appSchema";

export async function fetchAccommodations(): Promise<typeof accommodation.$inferSelect[]> {
    const response = await fetch(`${process.env.API_URL}/api/accommodation`, {
	cache: 'no-store'
});

if (!response.ok) {
	throw new Error('Erreur lors de la récupération des données');
}

const result = await response.json();
return result.data;
}

//ajout d'un logement
export async function addAccommodation(formData: FormData) {
    const response = await fetch(`${process.env.API_URL}/api/accommodation`, {
	method: 'POST',
	body: formData,
});
}

//mise à jour d'un logement
export async function updateAccommodation(id: number, formData: FormData) {
    const response = await fetch(`${process.env.API_URL}/api/accommodation?id=${id}`, {
	method: 'PUT',
	body: formData,
});
}

//suppression d'un logement
export async function deleteAccommodation(id: number) {
    const response = await fetch(`${process.env.API_URL}/api/accommodation?id=${id}`, {
	method: 'DELETE',
});
}
