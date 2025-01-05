module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

// Mock de @/db/db
jest.mock("@/db/db", () => ({
  insert: jest.fn().mockResolvedValue(true), // Simule l'insertion avec un retour de succès
  select: jest
    .fn()
    .mockResolvedValue([{ users_id: 1, token: "validToken", used: false }]), // Simule une sélection
  update: jest.fn().mockResolvedValue(true), // Simule une mise à jour
}));
