import jwt from 'jsonwebtoken';

// Mock jwt.sign
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
  verify: jest.fn(),
}));

describe('Token generation', () => {
  it('devrait générer un access token valide', () => {
    const token = generateAccessToken(1, 'owner');  // Assurez-vous que generateAccessToken est défini
    expect(token).toBeDefined();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1, role: 'owner' },
      expect.any(String),  // Clé secrète simulée
      { expiresIn: '15m' }
    );
  });
});
