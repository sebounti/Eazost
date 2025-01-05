import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  refreshToken,
  verifyRefreshToken,
  verifyToken,
  generateAccessToken,
  verifySessionToken, // Ajout de verifySessionToken
} from '@/app/api/services/tokenService';
import db from '@/db/db';
import { eq } from 'drizzle-orm/expressions';
import { usersVerification } from '@/db/schema';
import { saveTokenToDatabase } from '@/app/api/services/tokenService';
import fetch from 'node-fetch';
global.fetch = fetch as unknown as (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;


/**
 * Test Suite: Token Service Tests
 *
 * Description:
 * Ce fichier contient une série de tests pour vérifier le fonctionnement des tokens JWT.
 * Il couvre les cas de génération, vérification et gestion d'erreurs pour les tokens d'accès et de rafraîchissement.
 *
 * Tests Inclus :
 *
 * 1. **Basic token generation and verification**
 *    - Vérifie que la génération et la vérification d'un token avec jsonwebtoken fonctionnent correctement.
 *
 * 2. **should verify a valid access token**
 *    - Vérifie que le token d'accès est correctement généré et décodé avec l'ID utilisateur et le rôle.
 *
 * 3. **should verify a valid refresh token**
 *    - Vérifie que le token de rafraîchissement est valide avec les valeurs correctes d'ID utilisateur et de rôle.
 *
 * 4. **should reject an expired access token**
 *    - Vérifie qu'un token d'accès expiré renvoie une erreur `Token expired`.
 *
 * 5. **should reject an invalid access token**
 *    - Vérifie qu'un token d'accès invalide ou mal formé retourne une erreur `Invalid token`.
 *
 * 6. **should reject an expired refresh token**
 *    - Vérifie qu'un token de rafraîchissement expiré renvoie l'erreur `Refresh token expired`.
 *
 * 7. **should reject an invalid refresh token**
 *    - Vérifie qu’un token de rafraîchissement invalide retourne une erreur `Invalid token`.
 *
 * Objectif :
 * Assurer la sécurité et la gestion des erreurs pour les tokens JWT en couvrant divers scénarios.
 */


const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}




test('Vérifie que fetch est appelé correctement', async () => {
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
      headers: new Headers(),
      ok: true,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    } as Response)
  );
  global.fetch = mockFetch;



  const result = await verifyAuth('fake-token');
  expect(mockFetch).toHaveBeenCalledWith('/api/auth/verify', expect.any(Object));
  expect(result).toEqual({ success: true });
});
// Test de base pour vérifier la génération et la vérification d'un token
test('Basic token generation and verification', () => {
  const payload = { userId: 1, role: 'user' };
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  const decoded = jwt.verify(token, secret);
  expect(decoded).toMatchObject(payload);
});

describe('Token Service Tests', () => {
  const testUserId = 1;
  const testRole = 'owner';

  let validAccessToken: string;
  let expiredToken: string;
  let invalidToken: string;

  beforeAll(() => {
    validAccessToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1h' });
    expiredToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });
    invalidToken = 'invalid.token.structure';
  });

  it('should verify a valid access token', async () => {
    const result = await verifyToken(validAccessToken);
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('userId', testUserId);
    expect(result).toHaveProperty('role', testRole);
  });

  it('should verify a valid refresh token', async () => {
    const token = refreshToken(testUserId, testRole);
    const result = await verifyRefreshToken(token);
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('userId', testUserId);
    expect(result).toHaveProperty('role', testRole);
  });

  it('should include the correct role in the token payload', () => {
    const token = generateAccessToken(testUserId, 'admin');
    const decoded = jwt.verify(token, secret) as JwtPayload;
    expect(decoded.role).toBe('admin');
  });

  it('should reject a tampered token', async () => {
    const token = generateAccessToken(testUserId, testRole);
    const tamperedToken = token.slice(0, -1) + 'x';
    const result = await verifyToken(tamperedToken);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid token');
  });

  it('should generate a new access token with a valid refresh token', async () => {
    const refresh = refreshToken(testUserId, testRole);
    const isValid = await verifyRefreshToken(refresh);
    if (isValid.success) {
      const newAccessToken = generateAccessToken(isValid.userId!, isValid.role!);
      const decoded = jwt.verify(newAccessToken, secret) as JwtPayload;
      expect(decoded.userId).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
    }
  });

  it('should expire the token after the specified time', async () => {
    const shortLivedToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = await verifyToken(shortLivedToken);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Token expired');
  });

  it('should invalidate the token on logout', async () => {
    const token = generateAccessToken(testUserId, testRole);
    await saveTokenToDatabase(testUserId, token);
    await db.update(usersVerification).set({ used: true }).where(eq(usersVerification.token, token));
    const result = await verifyToken(token);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid or expired token');
  });

  it('should include specific permissions in the token payload', () => {
    const permissions = ['read', 'write'];
    const token = jwt.sign({ userId: testUserId, role: testRole, permissions }, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret) as JwtPayload & { permissions: string[] };
    expect(decoded.permissions).toEqual(permissions);
  });

  it('should not generate a new access token with an expired refresh token', async () => {
    const expiredRefreshToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = await verifyRefreshToken(expiredRefreshToken);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Refresh token expired');
  });

  // Tests pour verifySessionToken
  describe('verifySessionToken Tests', () => {
    it('should verify a valid session token', async () => {
      const result = await verifySessionToken(validAccessToken);
      expect(result.success).toBe(true);
      expect(result.userId).toBe(testUserId);
      expect(result.role).toBe(testRole);
      expect(result.message).toBe('Session token verified successfully');
    });

    it('should reject an expired session token', async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await verifySessionToken(expiredToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Token expired');
    });

    it('should reject an invalid session token', async () => {
      const result = await verifySessionToken(invalidToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid token');
    });

    it('should reject a used session token', async () => {
      await saveTokenToDatabase(testUserId, validAccessToken);
      await db.update(usersVerification).set({ used: true }).where(eq(usersVerification.token, validAccessToken));
      const result = await verifySessionToken(validAccessToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid or expired token');
    });
  });

  describe('Token Error Handling Tests', () => {
    it('should reject an expired access token', async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await verifyToken(expiredToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Token expired');
    });

    it('should reject an invalid access token', async () => {
      const result = await verifyToken(invalidToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid token');
    });

    it('should reject an expired refresh token', async () => {
      const expiredRefreshToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await verifyRefreshToken(expiredRefreshToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Refresh token expired');
    });

    it('should reject an invalid refresh token', async () => {
      const result = await verifyRefreshToken(invalidToken);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid token');
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});

describe('Token Service', () => {
  const secret = 'votre_secret_de_test';

  test('should verify JWT token correctly', () => {
    const payload = { userId: 1, role: 'user' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    expect(decoded).toMatchObject(payload);
  });

  // Test de verifyAuth si c'est la fonction que vous souhaitez tester
  test('verifyAuth should validate tokens', async () => {
    const payload = { userId: 1, role: 'user' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    const result = await verifyAuth(token);
    expect(result).toBeTruthy();
  });
});
