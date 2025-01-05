import db from '@/db/db';  // Assurez-vous que le bon chemin est utilisé.
import { usersVerification } from '@/db/schema';

/jest.mock('@/db/db', () => ({
	default: {
	  select: jest.fn().mockReturnThis(),
	  from: jest.fn().mockResolvedValue([{ users_id: 1, token: 'validToken', used: false }]),
	  insert: jest.fn().mockResolvedValue(true),
	  update: jest.fn().mockResolvedValue(true),
	}
  }));

  describe('Database operations', () => {
	it('should select from users verification', async () => {
	  // Ajoutez ceci pour vérifier si le mock est appliqué
	  console.log(db.select); // Cela devrait imprimer la fonction mockée si elle est correctement configurée

	  const result = await db.select().from('users_verification');
	  expect(result).toEqual([{ users_id: 1, token: 'validToken', used: false }]);
	  expect(db.select).toHaveBeenCalled();
	  expect(db.from).toHaveBeenCalledWith('users_verification');
	});

	it('should insert into users verification', async () => {
	  const insertResult = await db.insert('users_verification').values({
		users_id: 1,
		token: 'newToken',
		used: false
	  });
	  expect(insertResult).toBe(true);
	  expect(db.insert).toHaveBeenCalledWith('users_verification');
	  expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({ users_id: 1 }));
	});
  });
