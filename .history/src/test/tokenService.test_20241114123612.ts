import { db } from '@/db'; // Connexion à Drizzle
import { users_verification } from '@/db/schema'; // Importation de la définition de la table

describe('Database operations', () => {
  it('should select from users verification', async () => {
    const result = await db.select().from(users_verification); // Sélection des données dans users_verification
    expect(result).toEqual([{ users_id: 1, token: 'validToken', used: false }]);
  });

  it('should insert into users verification', async () => {
    const insertResult = await db.insert(users_verification).values({
      users_id: 1,
      token: 'newToken',
      used: false,
    });
    expect(insertResult).toHaveProperty('verification_id');
  });
});
