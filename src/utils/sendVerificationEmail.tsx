import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

//----- sendVerificationEmail -----//
// envoyer un email de vérification //

// Configuration de dotenv
dotenv.config();

// Fonction pour envoyer l'email de vérification avec EmailJS
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  console.log("URL de vérification générée:", verificationUrl);

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

	transporter.verify((error, success) => {
		if (error) {
		  console.error("Erreur de connexion au serveur SMTP :", error);
		} else {
		  console.log("Serveur SMTP prêt pour l'envoi d'emails :", success);
		}
	  });


	const mailOptions = {
		from : process.env.EMAIL_USER,
		to : email,
		subject : 'Veuillez vérifier votre email',
		html :`

		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
			<img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="Logo" style="max-width: 200px; margin-bottom: 20px;"/>
			<h2 style="color: #333;">Bienvenue sur notre plateforme !</h2>
			<p style="color: #666; line-height: 1.5;">Cher(e) utilisateur(trice),</p>
			<p style="color: #666; line-height: 1.5;">Nous vous remercions d'avoir créé un compte sur notre plateforme. Pour finaliser votre inscription et accéder à l'ensemble de nos services, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="${verificationUrl}" style="background-color: #fbbf24; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Vérifier mon adresse email</a>
			</div>
			<p style="color: #666; line-height: 1.5;">Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
			<p style="color: #666; word-break: break-all;">${verificationUrl}</p>
			<p style="color: #666; line-height: 1.5;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
			<hr style="border: 1px solid #eee; margin: 30px 0;"/>
			<p style="color: #999; font-size: 12px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
		</div>`,
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
