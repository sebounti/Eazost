/**
 * Logs user activity, including token, IP address, and user agent.
 * @param {string} token - The user's token.
 * @param {string} ipAddress - The user's IP address.
 * @param {string} userAgent - The user's user agent.
 */
export function logUserActivity(token: string, ipAddress: string, userAgent: string) {
	console.log(`Activity log: Token - ${token}, IP - ${ipAddress}, UserAgent - ${userAgent}`);
  }
