import db  from '@/db/db'; // Connexion à Drizzle
import { usersVerification } from '@/db/schema';

describe('Database operations', () => {
	it('should select from users verification', async () => {
	  const result = await db.select().from(usersVerification); // Sélection des données
	  expect(result).toEqual([
		{
		  users_id: 1,
		  token: 'validToken',
		  used: false,
		  created_at: expect.any(Date),
		  updated_at: expect.any(Date),
		  verification_id: expect.any(Number),
		},
	  ]);
	});

	it('should insert into users verification', async () => {
	  const insertResult = await db.insert(usersVerification).values({
		users_id: 1,
		token: 'newToken',
		used: false,
	  });

	  // Vérification que l'insertion a bien eu lieu
	  expect(insertResult).toHaveProperty('insertId'); // Vérifie que l'insert a bien retourné un ID
	});
  });
