import { generateAccessToken, refreshToken, verifyToken, verifyAccountToken, verifySessionToken, saveTokenToDatabase, setAuthCookies } from '@/app/api/services/tokenService';
import { jest } from '@jest/globals';
import db from '@/db/db';
import jwt from 'jsonwebtoken';

const testUserId = 1;
const testRole = 'owner';
const validToken = 'validToken';
const invalidToken = 'invalidToken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'),
  verify: jest.fn((token) => {
    if (token === validToken) {
      return { userId: testUserId, role: testRole };  // Simuler un token valide
    } else {
      throw new Error('Invalid token');  // Simuler un token invalide
    }
  }),
}));




describe('Token Service', () => {

  it('devrait générer un access token', () => {
    const token = generateAccessToken(testUserId, testRole);
    expect(token).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },
      expect.any(String),
      { expiresIn: '15m' }
    );
  });

  it('devrait générer un refresh token', () => {
    const token = refreshToken(testUserId, testRole);
    expect(token).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },
      expect.any(String),
      { expiresIn: '7d' }
    );
  });

  it('devrait vérifier un token valide', async () => {
    const result = await verifyToken(validToken);
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('userId', testUserId);
    expect(result).toHaveProperty('role', testRole);
  });

  it('devrait rejeter un token invalide', async () => {
    const result = await verifyToken(invalidToken);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid or expired token');
  });

  it('devrait enregistrer le token dans la base de données', async () => {
    const token = 'someToken';
    await saveTokenToDatabase(testUserId, token);
    expect(db.insert).toHaveBeenCalledWith({
      users_id: testUserId,
      token,
      used: false,
    });
  });

  it('devrait envoyer les tokens en tant que cookies', () => {
    const response: any = { headers: { append: jest.fn() } };  // Mock complet de l'objet `response`
    const accessToken = 'accessTokenMock';
    const refreshToken = 'refreshTokenMock';

    setAuthCookies(response, accessToken, refreshToken);

    expect(response.headers.append).toHaveBeenCalledWith(
      'Set-Cookie',
      `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=900`
    );
    expect(response.headers.append).toHaveBeenCalledWith(
      'Set-Cookie',
      `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
    );
  });

  it('devrait vérifier un token d\'inscription valide', async () => {
    const result = await verifyAccountToken(validToken);
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('userId', testUserId);
    expect(result).toHaveProperty('account_type', testRole);
  });

  it('devrait vérifier un token de session valide', async () => {
    const result = await verifySessionToken(validToken);
    expect(result.success).toBe(true);
    expect(result.userId).toBe(testUserId);
    expect(result.role).toBe(testRole);
  });
});
