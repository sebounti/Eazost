import { describe, it, expect } from '@jest/globals';
import { verifyToken } from '@/';

describe('TokenService', () => {
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJvd25lciIsImlhdCI6MTczMTU3ODE0NSwiZXhwIjoxNzMxNTc5MDQ1fQ.NTpzWLTCZ3xLanfiPwP3BAKva7NRBhraCYWgXeqPnDM';

  it('devrait vérifier un token valide', () => {
    const result = verifyToken(testToken);
    expect(result).toHaveProperty('userId', 1);
    expect(result).toHaveProperty('role', 'owner');
  });

  it('devrait rejeter un token invalide', () => {
    const result = verifyToken('token_invalide');
    expect(result).toBeNull();
  });
});
