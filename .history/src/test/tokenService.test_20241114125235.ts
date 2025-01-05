import jwt from 'jsonwebtoken';  // Assurez-vous que jwt est importé
import { generateAccessToken } from '@/app/api/services/tokenService';  // Assurez-vous que la fonction generateAccessToken est importée

// Mock de la méthode jwt.sign
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-token'),  // Simule le retour de la fonction jwt.sign
}));

describe('Token Service', () => {
  it('devrait générer un access token', () => {
    const testUserId = 1;
    const testRole = 'owner';

    // Votre fonction qui génère le token
    const token = generateAccessToken(testUserId, testRole);  // Assurez-vous que cette fonction existe

    // Vérification que le token est bien généré
    expect(token).toBe('mocked-token');

    // Vérification que jwt.sign a bien été appelé avec les bons paramètres
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: testUserId, role: testRole },  // Payload du token
      expect.any(String),  // Le secret pour signer le token
      { expiresIn: '15m' }  // Options du token
    );
  });
});
