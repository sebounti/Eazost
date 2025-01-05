export const errorMiddleware = (handler: Function) => {
	return async (req: Request, res?: Response) => {
	  try {
		// Exécuter le handler (la fonction principale de l'API)
		return await handler(req, res);
	  } catch (error) {
		console.error('Erreur capturée par le middleware:', error);

		// Définir un code d'erreur et un message d'erreur générique ou spécifique
		const status = (error as any).status || 500;
		const message = (error as any).message || 'Une erreur interne est survenue';

		// Retourner la réponse d'erreur JSON
		return new Response(JSON.stringify({ error: message }), { status });
	  }
	};
  };
  