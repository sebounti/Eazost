# Utiliser une version Node Alpine comme base
FROM node:22-alpine

# Installer netcat (nc) pour le script entrypoint.sh
RUN apk add --no-cache netcat-openbsd

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Ajouter netcat et les dépendances nécessaires pour bcrypt
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash

# Copier le fichier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Démarrer l'application avec le script entrypoint.sh ou en mode développement
#CMD ["sh", "./entrypoint.sh"]
CMD ["npm", "run", "dev"]

# Copier le reste de l'application
COPY . .

# Construire l'application Next.js en mode production
#RUN npm run build

# Exposer le port sur lequel ton app tourne (par ex. : 3000)
EXPOSE 3000

# Supprimez `node_modules` si nécessaire
RUN rm -rf node_modules

# Réinstallez les dépendances
RUN npm install
