// UserContext.test.js
import { render, screen } from "@testing-library/react";
import { UserProvider, useUser } from "@/context/userContext";
import "@testing-library/jest-dom";
import React from "react";
import { useRouter } from "next/router";
import { act } from '@testing-library/react';




// Mock de localStorage pour tester l'interaction avec `currentUser`
beforeEach(() => {
  localStorage.clear();
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  })),
}));


jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  push: jest.fn(),
  query: {},
  pathname: "/",
});

act(() => {
  fireEvent.click(buttonElement);
});

const TestComponent = () => {
  const { currentUser, handleLogin } = useUser();

  return (
    <div>
      <button
        onClick={() =>
          handleLogin({
            users_id: 1,
            account_type: "user",
            isAuthenticated: true,
            isLogged: true,
          })
        }
      >
        Log In
      </button>
      {currentUser ? <p>User Logged In</p> : <p>No User</p>}
    </div>
  );
};

describe("UserContext", () => {
  test("initializes with no current user", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );
    expect(screen.getByText("No User")).toBeInTheDocument();
  });

  test("updates currentUser on handleLogin", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>,
    );

    // Simuler un clic pour la connexion
    screen.getByText("Log In").click();

    // Vérifier que le texte a changé pour indiquer que l'utilisateur est connecté
    expect(screen.getByText("User Logged In")).toBeInTheDocument();

    // Vérifier que le `currentUser` a bien été mis dans le localStorage
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    expect(storedUser).toEqual({
      users_id: 1,
      account_type: "user",
      isAuthenticated: true,
      isLogged: true,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
});
