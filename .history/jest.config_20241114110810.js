module.exports = {
  preset: "ts-jest", // Utiliser ts-jest pour les fichiers TypeScript
  testEnvironment: "node", // Définir l'environnement de test (ici, Node.js)
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transformer les fichiers .ts et .tsx
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"], // Extensions des fichiers à tester
};
