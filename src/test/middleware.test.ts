import { NextRequest, NextResponse } from "next/server";
import middleware from "@/app/middleware";
import { verifySessionToken, generateAccessToken } from "@/app/api/services/allTokenService";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";


// Mock des méthodes de Next.js et des services de token
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({
      status: 200,
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
      }
    })),
    redirect: jest.fn(() => ({
      status: 302,
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
      }
    })),
  },
}));

jest.mock("@/app/api/services/tokenService", () => ({
  verifySessionToken: jest.fn(),
  generateAccessToken: jest.fn(),
}));

	interface MockNextRequest {
		nextUrl: URL;
		cookies: {
			get: (name: string) => { name: string; value: string } | undefined;
			getAll: () => { name: string; value: string }[];
			set: (name: string, value: string) => void;
			has: (name: string) => boolean;
			delete: (name: string) => boolean;
			clear: () => void;
			[Symbol.iterator]: () => IterableIterator<[string, string]>;
		};
		headers: Headers;
		method: string;
		url: string;
	}

	let req: MockNextRequest;

  beforeEach(() => {

	req = {
	  nextUrl: new URL("http://localhost/api/private"),
	  url: "http://localhost/api/private",
	  cookies: {
		get: jest.fn((name) => {
		  if (name === "accesstoken") return { value: "valid.access.token", name: "accesstoken" };
		  if (name === "refreshtoken") return { value: "valid.refresh.token", name: "refreshtoken" };
		  return undefined;
		}),
		getAll: jest.fn(),
		set: jest.fn(),
		has: jest.fn(),
		delete: jest.fn(),
		clear: jest.fn(),
		[Symbol.iterator]: jest.fn(),
	  },
	  headers: new Headers(),
	  method: "GET",
	} as MockNextRequest;

	jest.clearAllMocks();
  });

  function createMockRequest(path: string): MockNextRequest {
	return {
	  nextUrl: new URL(`http://localhost${path}`),
	  url: `http://localhost${path}`,
	  cookies: {
		get: jest.fn(),
		getAll: jest.fn(),
		set: jest.fn(),
		has: jest.fn(),
		delete: jest.fn(),
		clear: jest.fn(),
		[Symbol.iterator]: jest.fn(),
	  },
	  headers: new Headers(),
	  method: "GET",
	} as MockNextRequest;
  }

  // Utilisation dans les tests
it("should log the pathname for public routes", async () => {
	const req = createMockRequest("/login");
	console.log = jest.fn();

	const response = await middleware(req as unknown as NextRequest);
// Ajouter des assertions pour utiliser la réponse
expect(response.status).toBe(200); // ou une autre valeur attendue
// ou
expect(response.headers.get("some-header")).toBe("expected-value");
});

  it("should verify a valid access token and return NextResponse.next()", async () => {
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: "user",
    });

    const response = await middleware(req as unknown as NextRequest);

    expect(verifySessionToken).toHaveBeenCalledWith("valid.access.token");
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should redirect to access-denied for insufficient user permissions", async () => {
    req.nextUrl.pathname = "/api/admin";
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: "user", // Role insuffisant
    });

    const response = await middleware(req as unknown as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/access-denied", req.url));
    expect(response.status).toBe(302);
  });

  it("should generate and set a new access token if refresh token is valid", async () => {
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: "user",
    });
    (generateAccessToken as jest.Mock).mockReturnValue("new.access.token");

	const response = await middleware(req as unknown as NextRequest);

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
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({ success: false });

	const response = await middleware(req as unknown as NextRequest);

    expect(verifySessionToken).toHaveBeenCalledWith("invalid.refresh.token");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should redirect to login if no tokens are found", async () => {
    req.cookies.get = jest.fn(() => undefined);

	const response = await middleware(req as unknown as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should log the absence of refresh tokens when none are found", async () => {
    console.log = jest.fn();
    req.cookies.get = jest.fn((key) => (key === "accesstoken" ? undefined : undefined));

	const response = await middleware(req as unknown as NextRequest);

    expect(console.log).toHaveBeenCalledWith("Échec du renouvellement du token d’accès. Redirection vers login.");
  });

  it("should handle case where role is undefined when validating refresh token", async () => {
    (verifySessionToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      userId: 1,
      role: undefined, // Role indéfini
    });

    console.error = jest.fn();

    const response = await middleware(req as unknown as NextRequest);

    expect(console.error).toHaveBeenCalledWith("Role is undefined, cannot generate access token.");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });
