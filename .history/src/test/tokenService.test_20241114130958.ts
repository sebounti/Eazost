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

	
  });
