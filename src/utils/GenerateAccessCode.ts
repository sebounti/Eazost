import { db } from "@/db/db";
import { accessCode } from "@/db/appSchema";
import { v4 as uuidv4 } from 'uuid';

export const generateAccessCode = async (userId: string, accommodationId: number, validityDays: number) => {
	const uuid = uuidv4();
	const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

	// Calcul de la date d'expiration
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + validityDays);

	await db.insert(accessCode).values({
		uuid,
		accommodation_id: accommodationId,
		code,
		expiration_date: expirationDate, // Facultatif si vous ne souhaitez pas définir d'expiration
	});
};
