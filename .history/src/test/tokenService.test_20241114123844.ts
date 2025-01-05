import { db } from '@/db'; // Connexion à Drizzle
import { usersVerification } from '@/db/schema';
 // Utilisez le nom correct exporté
describe('Database operations', () => {
  it('should select from users verification', async () => {
    const result = await db.select().from(usersVerification); // Sélection des données dans users_verification
    expect(result).toEqual([{ users_id: 1, token: 'validToken', used: false }]);
  });

  it('should insert into users verification', async () => {
    const insertResult = await db.insert(usersVerification).values({
      users_id: 1,
      token: 'newToken',
      used: false,
    });
    expect(insertResult).toHaveProperty('verification_id');
  });
});
