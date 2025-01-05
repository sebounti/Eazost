import jwt from 'jsonwebtoken'; // Assurez-vous d'importer jwt si nécessaire

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-token'),  // Simule la génération d'un token
}));

describe('Token Service', () => {
  it('devrait générer un access token', () => {
    const testUserId = 1;
    const testRole = 'owner';

    // Simuler la génération du token
    const token = generateAccessToken(testUserId, testRole);

    expect(token).toBe('mocked-token');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },
      expect.any(String),  // Le secret doit être un string
      { expiresIn: '15m' }
    );
  });

  it('devrait générer un refresh token', () => {
    const testUserId = 1;
    const testRole = 'owner';

    // Simuler la génération du refresh token
    const refreshToken = generateRefreshToken(testUserId, testRole);

    expect(refreshToken).toBe('mocked-token');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },
      expect.any(String),  // Le secret doit être un string
      { expiresIn: '7d' }
    );
  });
});
