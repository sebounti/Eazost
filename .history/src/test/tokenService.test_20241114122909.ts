import db from '@/db/db';  // Assurez-vous que le bon chemin est utilisé.
import { usersVerification } from '@/db/schema';

// Simuler l'API de Drizzle avec les bonnes méthodes
jest.mock('@/db/db', () => ({
	default: {
	  select: jest.fn().mockReturnValue({
		from: jest.fn().mockResolvedValue([{ users_id: 1, token: 'validToken', used: false }]) // Simuler une requête SELECT
	  }),
	  insert: jest.fn().mockReturnValue({
		values: jest.fn().mockResolvedValue(true) // Simuler une insertion réussie
	  }),
	  update: jest.fn().mockResolvedValue(true) // Simuler une mise à jour réussie
	}
  }));

  describe('Database operations', () => {
	it('should select from users verification', async () => {
	  const result = await db.select().from('users_verification');
	  expect(result).toEqual([{ users_id: 1, token: 'validToken', used: false }]);
	  expect(db.select).toHaveBeenCalled();
	});

	it('should insert into users verification', async () => {
	  const insertResult = await db.insert('users_verification').values({
		users_id: 1,
		token: 'newToken',
		used: false
	  });
	  expect(insertResult).toBe(true); // Vérifier que l'insertion a réussi
	  expect(db.insert).toHaveBeenCalledWith('users_verification');
	});
  });

