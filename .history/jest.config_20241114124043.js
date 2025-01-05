module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  {
    "compilerOptions": {
      "baseUrl": ".", // Assurez-vous que la baseUrl est définie
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }

};
