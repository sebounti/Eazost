"use server";

import { stayInfo } from "@/db/appSchema";

export async function fetchStayInfo(): Promise<typeof stayInfo.$inferSelect[]> {
    const response = await fetch(`${process.env.API_URL}/api/stayInfo`, {
	cache: 'no-store'
});

if (!response.ok) {
	throw new Error('Erreur lors de la récupération des données');
}

const result = await response.json();
return result.data;
}

//ajout d'une information de séjour
export async function addStayInfo(formData: FormData) {
    const response = await fetch(`${process.env.API_URL}/api/stayInfo`, {
	method: 'POST',
	body: formData,
});
}

//mise à jour d'une information de séjour
export async function updateStayInfo(id: number, formData: FormData) {
    const response = await fetch(`${process.env.API_URL}/api/stayInfo?id=${id}`, {
	method: 'PUT',
	body: formData,
});
}

//suppression d'une information de séjour
export async function deleteStayInfo(id: number) {
    const response = await fetch(`${process.env.API_URL}/api/stayInfo?id=${id}`, {
	method: 'DELETE',
});
}
