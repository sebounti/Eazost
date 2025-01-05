import { generateAccessToken, verifyToken, refreshToken } from '@/app/api/services/tokenService';
import { setAuthCookies, verifyAccountToken } from '@/app/api/services/tokenService';
import jwt from 'jsonwebtoken';
import db from '@/db/db';



const testUserId = 1;  // Utilisateur fictif pour les tests
const testRole = 'owner';  // Rôle fictif pour les tests

describe('Token Service Tests', () => {
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
	  const validToken = 'valid.token.here'; // Remplacer par un token valide
	  const result = await verifyToken(validToken);
	  expect(result.success).toBe(true);
	  expect(result).toHaveProperty('userId', testUserId);
	  expect(result).toHaveProperty('role', testRole);
	});

	it('devrait rejeter un token invalide', async () => {
	  const invalidToken = 'invalid.token.here';
	  const result = await verifyToken(invalidToken);
	  expect(result.success).toBe(false);
	  expect(result.message).toBe('Invalid or expired token');
	});

	it('devrait envoyer les tokens en tant que cookies', () => {
	  const response = {
		headers: { append: jest.fn() },
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
		json: jest.fn(),
		text: jest.fn(),
	  } as unknown as Response;
	  setAuthCookies(response, 'accessToken', 'refreshToken');
	  expect(response.headers.append).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('accessToken=accessToken'));
	  expect(response.headers.append).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('refreshToken=refreshToken'));
	});

	it('devrait vérifier un token d\'inscription valide', async () => {
	  const validToken = 'valid.token.for.registration';
	  const result = await verifyAccountToken(validToken);
	  expect(result.success).toBe(true);
	  expect(result.userId).toBe(testUserId);
	});

	it('devrait échouer si le token d\'inscription est déjà utilisé', async () => {
	  const usedToken = 'used.token.for.registration';
	  jest.spyOn(db, 'select').mockReturnValue({
		from: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		execute: jest.fn().mockResolvedValue([{ token: usedToken, used: true }]),
		execute: jest.fn().mockResolvedValue([{ token: usedToken, used: true }]),
	  });
	  const result = await verifyAccountToken(usedToken);
	  expect(result.success).toBe(false);
	  expect(result.message).toBe('Token invalide ou déjà utilisé.');
	});
  });
