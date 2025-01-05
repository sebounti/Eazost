import jwt, { JwtPayload } from 'jsonwebtoken';
import { refreshToken, verifyRefreshToken, verifyToken ,generateAccessToken} from '@/app/api/services/tokenService';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Test de base pour vérifier la génération et la vérification d'un token
test('Basic token generation and verification', () => {
  const payload = { userId: 1, role: 'user' };

  // Générer un token directement avec jwt
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  // Vérifier le token immédiatement
  const decoded = jwt.verify(token, secret);

  expect(decoded).toMatchObject(payload);
});

// Tests existants
describe('Token Service Tests', () => {
  const testUserId = 1;
  const testRole = 'owner';

  let validAccessToken: string;
  let expiredToken: string;
  let invalidToken: string;

  beforeAll(() => {
    // Générer un token valide
    validAccessToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1h' });

    // Générer un token expiré
    expiredToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });

    // Générer un token invalide (structure incorrecte)
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
	const tamperedToken = token.slice(0, -1) + 'x'; // Altère le token
	const result = await verifyToken(tamperedToken);
	expect(result.success).toBe(false);
	expect(result.message).toBe('Invalid token');
  });


  it('should generate a new access token with a valid refresh token', async () => {
	const refresh = refreshToken(testUserId, testRole);
	const isValid = await verifyRefreshToken(refresh);
	if (isValid.success) {
    if (isValid.userId !== undefined && isValid.role !== undefined) {
      const newAccessToken = generateAccessToken(isValid.userId, isValid.role);
      const decoded = jwt.verify(newAccessToken, secret) as JwtPayload;
      expect(decoded.userId).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
    }
  }
  });


  it('should expire the token after the specified time', async () => {
	const shortLivedToken = jwt.sign({ userId: testUserId, role: testRole }, secret, { expiresIn: '1s' });
	await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre que le token expire
	const result = await verifyToken(shortLivedToken);
	expect(result.success).toBe(false);
	expect(result.message).toBe('Token expired');
  });

  it('should invalidate the token on logout', async () => {
	const token = generateAccessToken(testUserId, testRole);
	await saveTokenToDatabase(testUserId, token); // Sauvegarde initiale du token
	await db.update(usersVerification).set({ used: true }).where(eq(usersVerification.token, token)); // Marque comme utilisé/invalide
	const result = await verifyToken(token);
	expect(result.success).toBe(false);
	expect(result.message).toBe('Invalid or expired token');
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
});
