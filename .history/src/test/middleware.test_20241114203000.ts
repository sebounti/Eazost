import { NextRequest } from "next/server";
import middleware from "@/app/middleware";
import { verifyToken, generateAccessToken, verifySessionToken } from "@/app/api/services/tokenService";

// Simulation des fonctions du service de token
jest.mock('@/app/api/services/tokenService', () => ({
  verifyToken: jest.fn(),
  generateAccessToken: jest.fn(),
  verifySessionToken: jest.fn(),
}));

describe('Middleware Tests', () => {
  it('should redirect to login if both access and refresh tokens are invalid', async () => {
    const req = new NextRequest(new URL("http://localhost/api/private"));
    (verifyToken as jest.Mock).mockResolvedValueOnce({ success: false });
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: false });

    const response = await middleware(req);

    // Vérifie que le middleware redirige vers login
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get('location')).toContain('/login');
  });

  it('should set access token cookie when refresh token is valid', async () => {
    const req = new NextRequest(new URL('http://localhost/api/private'));
    req.cookies.set('refreshtoken', 'valid.refresh.token');

    // Simulation d'un refresh token valide et génération du token d'accès
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

    const response = await middleware(req);

    // Vérifie la création du cookie d'access token
    expect(response.cookies.get("accesstoken")?.value).toBe("new.access.token");
  });
});
