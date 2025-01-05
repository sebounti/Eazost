import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  refreshToken,
  verifyRefreshToken,
  verifyToken,
  generateAccessToken,
  verifySessionToken,
  verifyAccountToken,
  saveTokenToDatabase,
  setAuthCookies,
  getUserFromToken,
} from '@/app/api/services/tokenService';
import db from '@/db/db';
import { eq } from 'drizzle-orm/expressions';
import { usersVerification } from '@/db/schema';
import dotenv from 'dotenv';
import { Headers } from 'node-fetch';

// Charger les variables d'environnement
dotenv.config();

// Clé secrète pour les tests
const secret = process.env.JWT_SECRET || 'test_secret';

if (!secret) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

describe('Token Service Tests', () => {
  const testUserId = 1;
  const testRole = 'owner';
  const testToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1h' });

  beforeAll(async () => {
    // Initialiser les mocks ou nettoyer la base de données si nécessaire
    await db.delete(usersVerification).where(eq(usersVerification.users_id, testUserId));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Access Token Tests', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(testUserId, testRole);
      const decoded = jwt.verify(token, secret) as JwtPayload;
      expect(decoded.userId).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
    });

    it('should verify a valid access token', async () => {
      const token = generateAccessToken(testUserId, testRole);
      const result = await verifyToken(token);
      expect(result.success).toBe(true);
      expect(result.userId).toBe(testUserId);
      expect(result.role).toBe(testRole);
    });

    it('should reject an expired access token', async () => {
      const expiredToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Attendre l'expiration
      const result = await verifyToken(expiredToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Token expired');
    });
  });

  describe('Refresh Token Tests', () => {
    it('should generate a valid refresh token', () => {
      const token = refreshToken(testUserId, testRole);
      const decoded = jwt.verify(token, secret) as JwtPayload;
      expect(decoded.userId).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
    });

    it('should verify a valid refresh token', async () => {
      const token = refreshToken(testUserId, testRole);
      const result = await verifyRefreshToken(token);
      expect(result.success).toBe(true);
      expect(result.userId).toBe(testUserId);
      expect(result.role).toBe(testRole);
    });
  });

  describe('Session Token Tests', () => {
    it('should verify a valid session token', async () => {
      const result = await verifySessionToken(testToken);
      expect(result.success).toBe(true);
      expect(result.userId).toBe(testUserId);
      expect(result.role).toBe(testRole);
      expect(result.message).toBe('Session token verified successfully');
    });

    it('should reject an invalid session token', async () => {
      const invalidToken = 'invalid.token.structure';
      const result = await verifySessionToken(invalidToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid token');
    });
  });

  describe('Account Token Tests', () => {
    it('should verify a valid account token', async () => {
      const accountToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1h' });
      await saveTokenToDatabase(testUserId, accountToken);

      const result = await verifyAccountToken(accountToken);
      expect(result.success).toBe(true);
      expect(result.userId).toBe(testUserId);
      expect(result.account_type).toBe(testRole);
    });

    it('should reject an already used account token', async () => {
      const accountToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1h' });
      await saveTokenToDatabase(testUserId, accountToken);
      await db.update(usersVerification).set({ used: true }).where(eq(usersVerification.token, accountToken));

      const result = await verifyAccountToken(accountToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Le lien de validation est invalide ou expiré.');
    });
  });

  describe('Cookie Management Tests', () => {
    it('should set auth cookies', () => {
      const mockResponse = {
        headers: new Headers(),
      } as unknown as Response;

      const accessToken = generateAccessToken(testUserId, testRole);
      const refreshToken = refreshToken(testUserId, testRole);
      setAuthCookies(mockResponse, accessToken, refreshToken);

      const headers = mockResponse.headers as Headers;
      expect(headers.get('Set-Cookie')).toContain('accessToken');
      expect(headers.get('Set-Cookie')).toContain('refreshToken');
    });
  });

  describe('Get User From Token Tests', () => {
    it('should extract user from token in request headers', async () => {
      const mockRequest = {
        headers: new Headers({
          cookie: `token=${testToken}`,
        }),
      } as Request;

      const user = await getUserFromToken(mockRequest);
      expect(user.userId).toBe(testUserId);
      expect(user.role).toBe(testRole);
    });

    it('should throw an error if token is missing', async () => {
      const mockRequest = { headers: new Headers() } as Request;

      await expect(getUserFromToken(mockRequest)).rejects.toThrow('Authorization token missing or invalid');
    });
  });
});
