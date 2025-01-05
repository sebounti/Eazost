import { NextRequest } from "next/server";
import middleware from "@/app/middleware";
import { generateAccessToken, verifySessionToken } from "@/app/api/services/tokenService";


jest.mock("next/server", () => ({
	NextRequest: jest.fn(),
	NextResponse: jest.fn(),
  }));
jest.mock('@/app/api/services/tokenService', () => ({
  verifyToken: jest.fn(),
  generateAccessToken: jest.fn(),
  verifySessionToken: jest.fn(),
}));

describe('Middleware Tests', () => {
  it('should set access token cookie when refresh token is valid', async () => {
    const req = new NextRequest(new URL('http://localhost/api/private'));
    req.cookies.set('refreshtoken', 'valid.refresh.token');

    // Simuler un refresh token valide et une génération de token d'accès
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

    const response = await middleware(req);

    // Vérifie que le nouveau cookie d'access token est bien défini
    expect(response.cookies.get("accesstoken")?.value).toBe("new.access.token");
  });
});
