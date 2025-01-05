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
    const result = await db.select().from(usersVerification);
    expect(result).toEqual([{ users_id: 1, token: 'validToken', used: false }]);
    expect(db.select).toHaveBeenCalledWith(usersVerification);
    expect(db.select).toHaveBeenCalledWith('users_verification');
  });

    const insertResult = await db.insert(usersVerification).values({
    const insertResult = await db.insert('users_verification').values({
      users_id: 1,
      token: 'newToken',
      used: false
    });
    expect(insertResult).toBe(true);
    expect(db.insert).toHaveBeenCalledWith('users_verification');
  });
});
