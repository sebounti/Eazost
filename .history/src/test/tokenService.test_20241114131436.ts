import { refreshToken, verifyRefreshToken } from '@/app/api/services/tokenService'; // Assurez-vous que le chemin est correct


describe('Token Service Tests', () => {
	const testUserId = 1;
	const testRole = 'owner';

	it('should verify a valid refresh token', async () => {
	  const token = refreshToken(testUserId, testRole);  // Générez un refresh token
	  const result = await verifyRefreshToken(token);  // Vérifiez la validité du token

	  expect(result.success).toBe(true);  // Vérifie que le token est valide
	  expect(result).toHaveProperty('userId', testUserId);  // Vérifie que l'userId est correct
	  expect(result).toHaveProperty('role', testRole);  // Vérifie que le rôle est correct
	});

import jwt from 'jsonwebtoken';

describe('Token Service Error Handling Tests', () => {
  const testUserId = 1;
  const testRole = 'owner';
  const secret = 'your-secret-key'; // Remplacez par la clé secrète utilisée dans votre projet

  let validAccessToken: string;
  let expiredToken: string;
  let invalidToken: string;

  beforeAll(() => {
    // Générer un token valide
    validAccessToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1h' });

    // Générer un token expiré (expiation dans 1 seconde)
    expiredToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });

    // Générer un token invalide (structure incorrecte)
    invalidToken = 'invalid.token.structure';
  });

  it('should reject an expired access token', async () => {
    // Attendre 2 secondes pour que le token expire
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
    // Générer un refresh token expiré
    const expiredRefreshToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });

    // Attendre 2 secondes pour que le token expire
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


  });
