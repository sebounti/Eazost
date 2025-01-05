#!/bin/sh
echo "⚙️  Attente de MySQL..."
until nc -z mysql 3306; do
  echo "⏳ En attente de MySQL..."
  sleep 3
done


echo "📤 Exécution des migrations avec Drizzle..."
npx drizzle-kit migrate --config=./drizzle.config.ts

echo "🔄 Push des migrations avec Drizzle..."
npx drizzle-kit push --config=./drizzle.config.ts

echo "🚀 Démarrage de l'application..."
npm run dev
