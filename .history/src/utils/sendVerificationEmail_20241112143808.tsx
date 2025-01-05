import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Configuration de dotenv
dotenv.config();

const secretKey = process.env.JWT_SECRET as string; // Garde cette clé secrète
if (!secretKey) {
  throw new Error('JWT_SECRET is not defined');
}

// Fonction pour générer le token JWT
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' }); // Expire dans 1 heure
}

// Fonction pour envoyer l'email de vérification avec EmailJS
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;


	const transporter = nodemailer.createTransport({
		service : 'gmail',
		auth : {
			user : process.env.EMAIL_USER,
			pass : process.env.EMAIL_PASSWORD
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	const mailOptions = {
		from : process.env.EMAIL_USER,
		to : email,
		subject : 'Veuillez vérifier votre email',
		html :`
		
		<p>Bonjour,</p>
      	<p>Merci de vous être inscrit. Veuillez cliquer sur le lien suivant pour vérifier votre adresse email :</p>
     	<a href="${verificationUrl}">Vérifier mon email</a>
     	<p>Si vous n'avez pas demandé cette vérification, veuillez ignorer cet email.</p>
   		<p>Merci</p>`,
  		};


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.response);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur lors de l\'envoi de l\'email', error.message);
    } else {
      console.error('Erreur lors de l\'envoi de l\'email', error);
    }
  }
}
