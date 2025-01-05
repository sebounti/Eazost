import { NextRequest, NextResponse } from "next/server";
import middleware from "@/app/middleware";
import { verifySessionToken, generateAccessToken } from "@/app/api/services/tokenService";

// Mock des méthodes de Next.js et des services de token
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({ status: 200 })),
    redirect: jest.fn(() => ({ status: 302 })),
  },
}));

jest.mock("@/app/api/services/tokenService", () => ({
  verifySessionToken: jest.fn(),
  generateAccessToken: jest.fn(),
}));

describe("Middleware Tests - Uncovered Cases", () => {
  let req: Partial<NextRequest>;
  let cookies: Record<string, string>;

  beforeEach(() => {
    cookies = {};
    req = {
      cookies: {
        get: jest.fn((key) => cookies[key]),
        set: jest.fn((key, value) => {
          cookies[key] = value;
        }),
      },
      nextUrl: {
		pathname: "/api/private",
		origin: "http://localhost",
		
      url: "http://localhost/api/private",
    } as unknown as NextRequest;
    jest.clearAllMocks();
  });

  it("should log the pathname for public routes", async () => {
    req.nextUrl.pathname = "/login";

    console.log = jest.fn();
    const response = await middleware(req as NextRequest);

    expect(console.log).toHaveBeenCalledWith("Middleware exécuté pour la route:", "/login");
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should verify a valid access token and return NextResponse.next()", async () => {
    cookies["accesstoken"] = "valid.access.token";
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: "user",
    });

    const response = await middleware(req as NextRequest);

    expect(verifySessionToken).toHaveBeenCalledWith("valid.access.token");
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should redirect to access-denied for insufficient user permissions", async () => {
    cookies["accesstoken"] = "valid.access.token";
    req.nextUrl.pathname = "/api/admin";
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: "user", // Role insuffisant
    });

    const response = await middleware(req as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/access-denied", req.url));
    expect(response.status).toBe(302);
  });

  it("should generate and set a new access token if refresh token is valid", async () => {
    cookies["refreshtoken"] = "valid.refresh.token";
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: "user",
    });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

    const response = await middleware(req as NextRequest);

    expect(verifySessionToken).toHaveBeenCalledWith("valid.refresh.token");
    expect(generateAccessToken).toHaveBeenCalledWith(1, "user");
    expect(req.cookies.set).toHaveBeenCalledWith("accesstoken", "new.access.token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
    });
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should redirect to login if refresh token is invalid", async () => {
    cookies["refreshtoken"] = "invalid.refresh.token";
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: false });

    const response = await middleware(req as NextRequest);

    expect(verifySessionToken).toHaveBeenCalledWith("invalid.refresh.token");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should redirect to login if no tokens are found", async () => {
    req.cookies.get = jest.fn(() => undefined);

    const response = await middleware(req as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should log the absence of refresh tokens when none are found", async () => {
    console.log = jest.fn();
    req.cookies.get = jest.fn((key) => (key === "accesstoken" ? undefined : undefined));

    await middleware(req as NextRequest);

    expect(console.log).toHaveBeenCalledWith("Échec du renouvellement du token d’accès. Redirection vers login.");
  });

  it("should handle case where role is undefined when validating refresh token", async () => {
    cookies["refreshtoken"] = "valid.refresh.token";
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: undefined, // Role indéfini
    });

    console.error = jest.fn();

    const response = await middleware(req as NextRequest);

    expect(console.error).toHaveBeenCalledWith("Role is undefined, cannot generate access token.");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });
});
