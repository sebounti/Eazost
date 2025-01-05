import { generateRefreshToken } from './path/to/your/tokenService'; // Assurez-vous que le chemin est correct

describe('Token Service Tests', () => {
  const testUserId = 1;
  const testRole = 'owner';

  it('should generate a refresh token', () => {
    const token = generateRefreshToken(testUserId, testRole);
    expect(token).toBeDefined();  // Vérifie que le token est défini
    expect(typeof token).toBe('string');  // Vérifie que le token est bien une chaîne de caractères
    // Optionnel : vérifier la validité du token, par exemple en le décodant
    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty('userId', testUserId);  // Vérifie que les données sont correctes
    expect(decoded).toHaveProperty('role', testRole);  // Vérifie le rôle
  });
});
