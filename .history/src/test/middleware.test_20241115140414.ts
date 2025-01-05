import { NextRequest, NextResponse } from "next/server";
import middleware from "@/app/middleware";
import { generateAccessToken, verifySessionToken } from "@/app/api/services/tokenService";

// Simule les méthodes de Next.js et des services de token
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

describe("Middleware Tests", () => {
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
      nextUrl: { pathname: "/api/private" },
      url: "http://localhost/api/private",
    } as unknown as NextRequest;
    jest.clearAllMocks();
  });

  it("should bypass public routes without checking tokens", async () => {
    req.nextUrl.pathname = "/login";

    const response = await middleware(req as NextRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should redirect to login if no tokens are present", async () => {
    req.cookies.get = jest.fn(() => undefined);

    const response = await middleware(req as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should validate access token and allow access for authorized user", async () => {
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

  it("should redirect to access-denied if user role is insufficient", async () => {
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

  it("should refresh access token using a valid refresh token", async () => {
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
      maxAge: 60 * 60,
      sameSite: "strict",
    });
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should redirect to login if refresh token is invalid", async () => {
    cookies["refreshtoken"] = "invalid.refresh.token";
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: false,
    });

    const response = await middleware(req as NextRequest);

    expect(verifySessionToken).toHaveBeenCalledWith("invalid.refresh.token");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should log the pathname of the requested route", async () => {
    req.nextUrl.pathname = "/test-path";
    console.log = jest.fn();

    await middleware(req as NextRequest);

    expect(console.log).toHaveBeenCalledWith("Middleware exécuté pour la route:", "/test-path");
  });
});
