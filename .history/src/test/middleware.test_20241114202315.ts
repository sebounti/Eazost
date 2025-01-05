import { NextRequest, NextResponse } from "next/server";
import middleware from "@/app/middleware";
import { verifyToken, generateAccessToken, verifySessionToken } from "@/app/api/services/tokenService";

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

    // Utilise `toContain` pour ignorer la différence d'URL complète
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get('location')).toContain('/login');
  });

  it('should set access token cookie when refresh token is valid', async () => {
    const req = new NextRequest(new URL('http://localhost/api/private'));
    req.cookies.set('refreshtoken', 'valid.refresh.token');

    // Mock des tokens pour une configuration valide
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

    const response = await middleware(req);

    // Vérifie que le nouveau cookie d'access token est bien défini
    expect(response.cookies.get("accesstoken")?.value).toBe("new.access.token");
  });
});
