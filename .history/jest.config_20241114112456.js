module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    // Mapper l'alias '@' à 'src'
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

jest.mock('@/db/db', () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockResolvedValue(true), // Simule que la méthode values fonctionne
  }),

  
}));
