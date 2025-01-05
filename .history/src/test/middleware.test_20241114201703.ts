import { NextRequest } from "next/server";
import middleware from "@/app/middleware"; // Votre middleware
import { verifyToken, generateAccessToken, verifySessionToken } from "@/app/api/services/tokenService";

// Utilisez jest.mock pour simuler les fonctions de tokenService
jest.mock('@/app/api/services/tokenService', () => ({
  verifyToken: jest.fn(),
  generateAccessToken: jest.fn(),
}));

describe('Middleware Tests', () => {
  it('should handle invalid token', async () => {
    (verifyToken as jest.Mock).mockResolvedValueOnce({ success: false });

    const req = new NextRequest(new URL("http://localhost/api/private"));
    const response = await middleware(req);

    expect(response.status).toBe(302); // Exemple de redirection vers /login
  });

  it('should set access token cookie when refresh token is valid', async () => {
	const req = new NextRequest(new URL('http://localhost/api/private'));
	req.cookies.set('refreshtoken', 'valid.refresh.token');

	// Mock le token de session pour indiquer que le refresh token est valide
	verifySessionToken.mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
	generateAccessToken.mockReturnValue("new.access.token");

	const response = await middleware(req);
	expect(response.cookies.get("accesstoken")).toBeDefined();
  });


  // Ajoutez d'autres tests similaires en utilisant les mocks
});
