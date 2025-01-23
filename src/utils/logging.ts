//----- logging -----//
// logging pour les activités des utilisateurs //

export function logUserActivity(token: string, ipAddress: string, userAgent: string) {
	console.log(`Activity log: Token - ${token}, IP - ${ipAddress}, UserAgent - ${userAgent}`);
  }
