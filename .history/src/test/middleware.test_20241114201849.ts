import { NextRequest } from "next/server";
import middleware from "@/app/middleware"; // Votre middleware
import { verifyToken, generateAccessToken, verifySessionToken } from "@/app/api/services/tokenService";

// Utilisez jest.mock pour simuler les fonctions de tokenService
jest.mock('@/app/api/services/tokenService', () => ({
  verifyToken: jest.fn(),
  generateAccessToken: jest.fn(),
  verifySessionToken: jest.fn(),
}));

describe('Middleware Tests', () => {
  it('should handle invalid token', async () => {
    (verifyToken as jest.Mock).mockResolvedValueOnce({ success: false });

    const req = new NextRequest(new URL("http://localhost/api/private"));
    const response = await middleware(req);

    // On s'attend à une redirection vers la page de connexion (statut 302 ou 307 selon la redirection)
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
  });

  it('should set access token cookie when refresh token is valid', async () => {
    const req = new NextRequest(new URL('http://localhost/api/private'));
    req.cookies.set('refreshtoken', 'valid.refresh.token');

    // Simule un refresh token valide et un nouvel access token généré
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

    const response = await middleware(req);

    // Vérifie que le nouveau cookie d'access token est bien défini dans la réponse
    const accessTokenCookie = response.cookies.get("accesstoken");
    expect(accessTokenCookie).toBeDefined();
    expect(accessTokenCookie?.value).toBe("new.access.token");
  });

  it('should redirect to login if both access and refresh tokens are invalid', async () => {
    const req = new NextRequest(new URL("http://localhost/api/private"));

    // Simule un token d'accès et un refresh token tous les deux invalides
    (verifyToken as jest.Mock).mockResolvedValueOnce({ success: false });
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: false });

    const response = await middleware(req);

    // Vérifie que la réponse est une redirection vers la page de login
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get('location')).toBe('/login');
  });

  it('should allow access to public routes without token', async () => {
    const req = new NextRequest(new URL("http://localhost/login"));

    const response = await middleware(req);

    // Vérifie que la requête passe à la route suivante sans redirection
    expect(response.status).toBe(200);
  });
});
