import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Fournissez le chemin de votre app Next.js pour charger next.config.js et les fichiers .env
  dir: './',
});

// Configuration personnalisée pour Jest
const config: Config = {
  coverageProvider: 'v8', // Utilise v8 pour la couverture
  testEnvironment: 'jsdom', // Environnement pour les tests côté client
  moduleNameMapper: {
    // Mapping des alias de module Path pour Jest
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Transpilation des fichiers TypeScript/JavaScript
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Configurations supplémentaires avant chaque test
  collectCoverage: true, // Active les rapports de couverture
  coverageDirectory: 'coverage', // Dossier pour stocker les rapports
};

// Exportation de la configuration avec next/jest
export default createJestConfig(config);
