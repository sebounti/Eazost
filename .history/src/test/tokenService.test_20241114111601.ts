import { verifyToken } from '@/app/api/services/tokenService';

describe('TokenService', () => {
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJvd25lciIsImlhdCI6MTczMTU3ODE0NSwiZXhwIjoxNzMxNTc5MDQ1fQ.NTpzWLTCZ3xLanfiPwP3BAKva7NRBhraCYWgXeqPnDM';
  const invalidToken = 'invalidToken';

  it('devrait vérifier un token valide', () => {
    const result = verifyToken(validToken);
    expect(result).toHaveProperty('userId', 1);
    expect(result).toHaveProperty('role', 'owner');
  });

  it('devrait rejeter un token invalide', () => {
    const result = verifyToken(invalidToken);
    expect(result).toBeNull(); // Nous nous attendons à ce que le résultat soit null
  });
});
