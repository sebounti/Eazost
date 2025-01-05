import { NextRequest, NextResponse } from "next/server";
import middleware from "@/app/middleware";
import { generateAccessToken, verifySessionToken } from "@/app/api/services/tokenService";

// Simulez les méthodes de Next.js et des services de token
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
    cookies: {
      set: jest.fn(),
      get: jest.fn(),
    },
  },
}));

jest.mock('@/app/api/services/tokenService', () => ({
  verifyToken: jest.fn(),
  generateAccessToken: jest.fn(),
  verifySessionToken: jest.fn(),
}));

describe('Middleware Tests', () => {
  it('should set access token cookie when refresh token is valid', async () => {
    // Simulation de la requête avec cookies
    const req = {
      cookies: {
        set: jest.fn(),
        get: jest.fn().mockReturnValue('valid.refresh.token'),
      },
      url: 'http://localhost/api/private',
    } as unknown as NextRequest;

    // Simulez les fonctions du service de token
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

    // Appel de la fonction middleware avec la requête simulée
    const NextResponse = await middleware(req);

    // Vérification que le cookie d'access token est défini correctement
    expect(req.cookies.set).toHaveBeenCalledWith("accesstoken", "new.access.token");
  });
});
