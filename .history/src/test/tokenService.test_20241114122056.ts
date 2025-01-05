import db from '@/db/db';  // Assurez-vous que le bon chemin est utilisé.

jest.mock('@/db/db', () => ({
  db: {
    select: jest.fn().mockResolvedValue([{ users_id: 1, token: 'validToken', used: false }]),
    insert: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
  }
}));

describe('Database operations', () => {
  it('devrait simuler la sélection d\'un token valide', async () => {
    const result = await db.select().from('users_verification');
    expect(result).toEqual([{ users_id: 1, token: 'validToken', used: false }]);
    expect(db.select).toHaveBeenCalledWith('users_verification');
  });

  it('devrait simuler l\'insertion d\'un token', async () => {
    const insertResult = await db.insert('users_verification').values({
      users_id: 1,
      token: 'newToken',
      used: false
    });
    expect(insertResult).toBe(true);
    expect(db.insert).toHaveBeenCalledWith('users_verification');
  });
});
