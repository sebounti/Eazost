module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Mapping de l'alias @ vers le répertoire src
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "jsdom",
};

export default {
  testEnvironment: "node", // Changez cela si vous n'avez pas besoin de `jsdom`
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
};
