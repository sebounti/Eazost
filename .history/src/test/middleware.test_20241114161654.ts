import { NextRequest } from "next/server";
import middleware from "@/app/middleware"; // Votre middleware
import { verifyToken, generateAccessToken } from "@/app/api/services/tokenService";

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

  it('should generate new access token with valid refresh token', async () => {
    (verifyToken as jest.Mock).mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

    const req = new NextRequest(new URL("http://localhost/api/refresh"));
    const response = await middleware(req);

    expect(response.cookies.get("accesstoken")?.value).toBe("new.access.token");
  });

  // Ajoutez d'autres tests similaires en utilisant les mocks
});
