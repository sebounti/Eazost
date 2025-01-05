import jwt from 'jsonwebtoken';


test('Basic token generation and verification', () => {
  const secretkey = process.env.JWT_SECRET;
  const payload = { userId: 1, role: 'user' };

  // Générer un token directement avec jwt
  const token = jwt.sign(payload, secretkey, { expiresIn: '1h' });

  // Vérifier le token immédiatement
  const decoded = jwt.verify(token, secretkey);

  expect(decoded).toMatchObject(payload);
});
