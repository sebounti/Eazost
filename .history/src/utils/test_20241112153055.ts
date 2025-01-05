import { sendVerificationEmail } from '@/utils/sendVerificationEmail';

// Adresse email de test et token simulé
const testEmail = 'sebastienlenne@gmail.com';
const testToken = 'ba'; // Utilise un token fictif pour le test

// Fonction principale de test
async function testSendVerificationEmail() {
  try {
    await sendVerificationEmail(testEmail, testToken);
    console.log('Email de vérification envoyé avec succès');
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de vérification :", error);
  }
}

// Appelle la fonction de test
testSendVerificationEmail();
