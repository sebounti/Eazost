import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as appSchema from './appSchema';
import * as authSchema from './authSchema';

// Configuration de dotenv
dotenv.config();

// Vérification des variables d'environnement
if (!process.env.DATABASE_HOST || !process.env.DATABASE_USERNAME || !process.env.DATABASE_PASSWORD || !process.env.DATABASE_NAME) {
	throw new Error('Variables d\'environnement de base de données manquantes');
}

// Creation du pool de connection
const pool = mysql.createPool({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// Test de la connexion
pool.getConnection()
	.then(connection => {
		console.log('✅ Connexion à la base de données établie');
		connection.release();
	})
	.catch(err => {
		console.error('❌ Erreur de connexion à la base de données:', err);
		throw err;
	});

// export de la connection
export const db = drizzle(pool, {
	schema: {
		...appSchema,
		...authSchema
	},
	mode: 'default'
});
