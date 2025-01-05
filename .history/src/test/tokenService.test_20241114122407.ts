import db from '@/db/db';  // Assurez-vous que le bon chemin est utilisé.
import { usersVerification } from '@/db/schema';

jest.mock('@/db/db', () => ({
	db: {
	  select: jest.fn().mockResolvedValue([{ users_id: 1, token: 'validToken', used: false }]),
	  insert: jest.fn().mockResolvedValue(true),
	  update: jest.fn().mockResolvedValue(true),
	}
  }));

  describe('Database operations', () => {
	it('should select from users verification', async () => {
	  const result = await db.select().from('usersverification');
	  expect(result).toEqual([{ users_id: 1, token: 'validToken', used: false }]);
	  expect(db.select).toHaveBeenCalled();
	});

	it('should insert into users verification', async () => {
	  const insertResult = await db.insert('users_verification').values({
		users_id: 1,
		token: 'newToken',
		used: false
	  });
	  expect(insertResult).toBe(true);  // Vérifiez que l'insertion retourne bien la valeur attendue
	  expect(db.insert).toHaveBeenCalledWith('users_verification');
	});
  });
