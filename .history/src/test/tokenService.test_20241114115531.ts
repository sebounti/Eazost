import { generateAccessToken, verifyToken, refreshToken } from '@/app/api/services/tokenService';

const testUserId = 1;  // Utilisateur fictif pour les tests
const testRole = 'owner';  // Rôle fictif pour les tests
const validToken = generateAccessToken(testUserId, testRole);
const invalidToken = 'invalidToken';  // Token invalide pour les tests

describe('Token Service Simplified', () => {
  it('devrait générer un access token', () => {
    const token = generateAccessToken(testUserId, testRole);
    expect(token).toBeDefined();
  });

  it('devrait vérifier un token valide', async () => {
    const result = await verifyToken(validToken);
    expect(result.success).toBe(true);
    expect(result.userId).toBe(testUserId);
    expect(result.role).toBe(testRole);
  });

  it('devrait rejeter un token invalide', async () => {
    const result = await verifyToken(invalidToken);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid or expired token');
  });

  it('devrait générer un refresh token', () => {
    const token = refreshToken(testUserId, testRole);
    expect(token).toBeDefined();
  });
});
