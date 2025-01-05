import { NextRequest, NextResponse } from "next/server";
import middleware from "@/app/";
import { verifySessionToken, generateAccessToken } from '@/app/api/services/tokenService';

// Mock de `NextResponse`
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => new NextResponse()),
    redirect: jest.fn((url) => new NextResponse(null, { headers: { location: url } })),
  },
}));

// Mock des services de token
jest.mock("@/app/api/services/tokenService", () => ({
  verifySessionToken: jest.fn(),
  generateAccessToken: jest.fn(),
}));

describe("Middleware Tests", () => {
  const publicRoutes = ['/login', '/registration', '/api/auth'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access to public routes without token verification", async () => {
    for (const route of publicRoutes) {
      const req = new NextRequest(new URL(`http://localhost${route}`));
      const response = await middleware(req);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    }
  });

  it("should redirect to login if accesstoken is missing", async () => {
    const req = new NextRequest(new URL("http://localhost/api/protected"));
    const response = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', req.url));
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("should redirect to login if accesstoken is invalid", async () => {
    verifySessionToken.mockResolvedValueOnce({ success: false });
    const req = new NextRequest(new URL("http://localhost/api/protected"));
    req.cookies.set("accesstoken", "invalid.token");
    const response = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', req.url));
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("should allow access with valid accesstoken", async () => {
    verifySessionToken.mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    const req = new NextRequest(new URL("http://localhost/api/protected"));
    req.cookies.set("accesstoken", "valid.token");

    const response = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("should redirect to access-denied if user lacks necessary permissions", async () => {
    verifySessionToken.mockResolvedValueOnce({ success: true, userId: 1, role: 'user' });
    const req = new NextRequest(new URL("http://localhost/api/admin/protected"));
    req.cookies.set("accesstoken", "valid.token");

    const response = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/access-denied', req.url));
    expect(response).toBeInstanceOf(NextResponse);
  });

  it("should generate a new accesstoken if refreshToken is valid", async () => {
    verifySessionToken
      .mockResolvedValueOnce({ success: false }) // Invalid accesstoken
      .mockResolvedValueOnce({ success: true, userId: 1, role: 'user' }); // Valid refreshToken

    generateAccessToken.mockReturnValue("new.access.token");

    const req = new NextRequest(new URL("http://localhost/api/protected"));
    req.cookies.set("refreshtoken", "valid.refresh.token");

    const response = await middleware(req);

    expect(generateAccessToken).toHaveBeenCalledWith(1, 'user');
    expect(response.cookies.get("accesstoken").value).toBe("new.access.token");
  });

  it("should redirect to login if refreshToken is missing or invalid", async () => {
    verifySessionToken.mockResolvedValueOnce({ success: false });
    const req = new NextRequest(new URL("http://localhost/api/protected"));

    const response = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', req.url));
    expect(response).toBeInstanceOf(NextResponse);
  });
});
