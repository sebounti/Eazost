import db from '@/db/db';
import jwt from 'jsonwebtoken';  // Importation correcte de jwt
import { generateAccessToken, saveTokenToDatabase, verifyAccountToken, verifyToken, refreshToken, setAuthCookies, verifySessionToken } from '@/app/api/services/tokenService';

const testUserId = 1;  // Déclaration et initialisation avant les mocks
const testRole = 'owner';
const validToken = generateAccessToken(testUserId, testRole);
const invalidToken = 'invalidToken';

// Mock de la base de données
jest.mock('@/db/db', () => ({
  db: {
    insert: jest.fn().mockResolvedValue(true), // Simuler une insertion réussie
    select: jest.fn().mockResolvedValue([{ users_id: testUserId, token: validToken, used: false }]), // Simuler la sélection d'un token valide
    update: jest.fn().mockResolvedValue(true), // Simuler une mise à jour réussie
  },
}));

describe('Token Service', () => {
  it('devrait générer un access token', () => {
    const token = generateAccessToken(testUserId, testRole);
    expect(token).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },
      expect.any(String),
      expect.objectContaining({ expiresIn: '15m' })
    );
  });

  it('devrait générer un refresh token', () => {
    const token = refreshToken(testUserId, testRole);
    expect(token).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },
      expect.any(String),
      expect.objectContaining({ expiresIn: '7d' })
    );
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
    const accessToken = 'someAccessToken';
    const refreshToken = 'someRefreshToken';
    const response = {
      headers: {
        append: jest.fn()
      },
      status: 200,
      statusText: "OK",
      ok: true,
      redirected: false,
      url: "",
      type: "basic",
      body: null,
      bodyUsed: false,
      clone: jest.fn(),
      json: jest.fn(),
      text: jest.fn(),
    };
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
    expect(result.userId).toBe(testUserId);
    expect(result.account_type).toBe(testRole);
  });

  it('devrait vérifier un token de session valide', async () => {
    const result = await verifySessionToken(validToken);
    expect(result.success).toBe(true);
    expect(result.userId).toBe(testUserId);
    expect(result.role).toBe(testRole);
  });
});
