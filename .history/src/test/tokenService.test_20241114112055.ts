import { generateAccessToken, refreshToken, verifyToken, setAuthCookies, saveTokenToDatabase, verifyAccountToken, verifySessionToken } from '@/app/api/services/tokenService';
import jwt from 'jsonwebtoken';
import db from '@/db/db';
import { usersVerification } from '@/db/schema';

jest.mock('@/db/db'); // Mock db operations
jest.mock('jsonwebtoken'); // Mock jwt functions

describe('Token Service', () => {
  const testUserId = 1;
  const testRole = 'owner';
  const validToken = generateAccessToken(testUserId, testRole);
  const invalidToken = 'invalidToken';

  beforeEach(() => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockImplementation((token, secret) => {
      if (token === validToken) {
        return { userId: testUserId, role: testRole };
      }
      throw new jwt.JsonWebTokenError('Invalid or expired token');
    });

    // Mock DB insert
    (db.insert as jest.Mock).mockResolvedValue({ success: true });
  });

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
    expect(db.insert).toHaveBeenCalledWith(usersVerification);
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
    const validVerificationToken = 'validVerificationToken';
    const mockVerificationResult = { success: true, userId: testUserId, account_type: testRole };
    await saveTokenToDatabase(testUserId, validVerificationToken);
    const result = await verifyAccountToken(validVerificationToken);
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
