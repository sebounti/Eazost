import { RefreshToken } from '@/app/api/services'; // Assurez-vous que le chemin est correct
import jwt from 'jsonwebtoken';


describe('Token Service Tests', () => {
  const testUserId = 1;
  const testRole = 'owner';

  it('should generate a refresh token', () => {
    const token = RefreshToken(testUserId, testRole);
    expect(token).toBeDefined();  // Vérifie que le token est défini
    expect(typeof token).toBe('string');  // Vérifie que le token est bien une chaîne de caractères
    // Optionnel : vérifier la validité du token, par exemple en le décodant
    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty('userId', testUserId);  // Vérifie que les données sont correctes
    expect(decoded).toHaveProperty('role', testRole);  // Vérifie le rôle
  });
});
