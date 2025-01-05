import { generateAccessToken, refreshToken, verifyToken, setAuthCookies, saveTokenToDatabase, verifyAccountToken, verifySessionToken } from '@/app/api/services/tokenService';
import jwt from 'jsonwebtoken';
import db from '@/db/db';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'),
  verify: jest.fn(() => ({ userId: 1, role: 'owner' })),  // Retourne des données mockées pour le token
}));

jest.mock('@/db/db', () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockResolvedValue(true),
  }),
  select: jest.fn().mockResolvedValue([{ users_id: 1, token: 'validToken', used: false }]),
  update: jest.fn().mockResolvedValue(true),
}));

describe('Token Service', () => {
  const testUserId = 1;
  const testRole = 'owner';
  const validToken = 'mockedToken';
  const invalidToken = 'invalidToken';

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
    const mockResponse = {
      headers: {
        append: jest.fn(),
      },
    } as unknown as Response;

    setAuthCookies(mockResponse, validToken, invalidToken);
    expect(mockResponse.headers.append).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining(`accessToken=${validToken}`)
    );
    expect(mockResponse.headers.append).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining(`refreshToken=${invalidToken}`)
    );
  });

  it('devrait vérifier un token d\'inscription valide', async () => {
    const result = await verifyAccountToken('validToken');
    expect(result.success).toBe(true);
  });

  it('devrait vérifier un token de session valide', async () => {
    const result = await verifySessionToken(validToken);
    expect(result.success).toBe(true);
    expect(result.userId).toBe(testUserId);
    expect(result.role).toBe(testRole);
  });
});
