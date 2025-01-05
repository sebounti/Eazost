import { generateAccessToken, verifyToken, setAuthCookies, verifyAccountToken } from '@/app/api/services/tokenService';
import jwt from 'jsonwebtoken';  // Assurez-vous que vous avez mocké jwt

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn() as jest.MockedFunction<typeof jwt.verify>,
}));

jest.mock('@/db/db', () => ({
  db: {
    insert: jest.fn().mockResolvedValue(true), // Mock pour l'insertion réussie
    select: jest.fn().mockResolvedValue([{ users_id: 1, token: 'validToken', used: false }]),
    update: jest.fn().mockResolvedValue(true),
  }
}));

describe('Token Service Tests', () => {
  const testUserId = 1;
  const testRole = 'owner';
  const validToken = 'valid.token.here';
  const invalidToken = 'invalid.token.here';

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
    const token = generateAccessToken(testUserId, testRole);
    expect(token).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },
      expect.any(String),
      { expiresIn: '7d' }
    );
  });

  it('devrait vérifier un token valide', async () => {
    jwt.verify.mockImplementation(() => ({ userId: testUserId, role: testRole }));
    const result = await verifyToken(validToken);
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('userId', testUserId);
    expect(result).toHaveProperty('role', testRole);
  });

  it('devrait rejeter un token invalide', async () => {
    jwt.verify.mockRejectedValue(new Error('invalid token'));
    const result = await verifyToken(invalidToken);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid or expired token');
  });

  it('devrait envoyer les tokens en tant que cookies', () => {
    const response = {
      headers: { append: jest.fn() },
    };
    setAuthCookies(response, 'accessToken', 'refreshToken');
    expect(response.headers.append).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('accessToken=accessToken'));
    expect(response.headers.append).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('refreshToken=refreshToken'));
  });

  it('devrait vérifier un token d\'inscription valide', async () => {
    jwt.verify.mockResolvedValue({ userId: testUserId, role: testRole });
    const result = await verifyAccountToken(validToken);
    expect(result.success).toBe(true);
    expect(result.userId).toBe(testUserId);
  });
});
