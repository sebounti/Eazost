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
      nextUrl: { pathname: "/api/private" },
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

  it("should redirect to access-denied for insufficient user permissions", async () =>
