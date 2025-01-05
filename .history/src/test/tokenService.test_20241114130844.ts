import { refreshToken, verifyRefreshToken } from '@/app/api/services/tokenService'; // Assurez-vous que le chemin est correct
import jwt from 'jsonwebtoken';


describe('Token Service Tests', () => {
	const testUserId = 1;
	const testRole = 'owner';

	it('should verify a valid refresh token', () => {
	  const token = refreshToken(testUserId, testRole);  // Générez un refresh token
	  const result = verifyRefreshToken(token);  // Vérifiez la validité du token

	  expect(result.success).toBe(true);  // Vérifie que le token est valide
	  expect(result).toHaveProperty('userId', testUserId);  // Vérifie que l'userId est correct
	  expect(result).toHaveProperty('role', testRole);  // Vérifie que le rôle est correct
	});

	it('should reject an invalid refresh token', () => {
	  const invalidToken = 'invalid.token';
	  const result = verifyRefreshToken(invalidToken);  // Vérifie un token invalide

	  expect(result.success).toBe(false);  // Le token doit être rejeté
	  expect(result.message).toBe('Invalid or expired token');  // Vérifie le message d'erreur
	});
  });
