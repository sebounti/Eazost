import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// Configuration du cache pour stocker les requêtes
const rateLimit = new LRUCache<string, number>({
  max: 500, // Le nombre maximum d'IP ou d'utilisateurs qu'on peut suivre
  ttl: 1000 * 60 * 15 // Durée de vie de chaque entrée (15 minutes)
});

// Limite de 100 requêtes par 15 minutes par utilisateur
const rateLimiter = (limit: number) => {
  return (request: Request) => {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'; // Récupère l'IP

    const hits = rateLimit.get(ip) || 0;

    if (hits >= limit) {
      return NextResponse.json({ message: 'Too many requests, please try again later.' }, { status: 429 });
    }

    rateLimit.set(ip, hits + 1);
    return null; // Autoriser la requête si elle est dans la limite
  };
};

export default rateLimiter;
