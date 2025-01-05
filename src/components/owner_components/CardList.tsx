import React, { useEffect, useState } from "react";
import { CardSchema } from "@/validation/CardSchema";
import db from "@/db/db";

// Composant qui reçoit les données des cartes depuis l'API et les valide avec Zod
const CardList = () => {
  const [validCards, setValidCards] = useState<Array<typeof CardSchema._type>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cards"); // Change l'URL en fonction de ton endpoint API réel
      const data = await response.json();

      // Valider chaque carte avec Zod
      const parsedCards = data.map((card: typeof CardSchema._type) => {
        const result = CardSchema.safeParse(card);
        if (!result.success) {
          console.error("Invalid card data:", result.error);
          return null; // Ignore les cartes invalides
        }
        return result.data; // Retourne les cartes valides
      }).filter(Boolean); // Supprime les cartes invalides

      setValidCards(parsedCards); // Met à jour l'état avec les cartes valides
      setError(null); // Reset l'erreur s'il n'y en a pas
    } catch (err) {
      setError("Failed to fetch cards");
      console.error(err);
    } finally {
      setLoading(false); // Désactive l'état de chargement
    }
  };

  // Récupère les cartes depuis l'API lors du premier rendu du composant
  useEffect(() => {
    fetchCards();
  }, []);

  // Gestion du chargement et des erreurs
  if (loading) {
    return <p>Loading cards...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {validCards.length === 0 ? (
        <p>No valid cards</p>
      ) : (
        <ul>
          {validCards.map((card) => (
            <li key={card.id}>{card.title} - {card.category} - ${card.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardList;
