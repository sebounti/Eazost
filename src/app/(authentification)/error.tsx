'use client';
import React from 'react';
/**
 * Error page.
 *
 * This page displays the error page.
 */

type ErrorProps = {
  error: Error; // Correction : Utilisez le type Error pour refléter un objet d'erreur
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  return (
    <div>
      <h1>Oups an error has occurred </h1>
      <p>There was an error: {error.message || 'Unknown error'}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
