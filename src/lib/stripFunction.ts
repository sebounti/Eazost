import { stripe } from "@/lib/stripe";


// Fonction pour créer un Payment Intent
export async function createPaymentIntent(amount: number, currency: string) {
	const paymentIntent = await stripe.paymentIntents.create({
	  amount, // Montant à facturer (en centimes)
	  currency, // Devise comme "eur" ou "usd"
	});

	return paymentIntent;
  }


// Fonction pour créer un Invoice Item
async function addInvoiceItem(customerId: string, description: string, amount: number, currency: string) {
	const invoiceItem = await stripe.invoiceItems.create({
	  customer: customerId, // ID du client Stripe
	  description, // Description de l'élément
	  amount, // Montant en centimes
	  currency, // Devise (exemple : "eur")
	});

	return invoiceItem;
  }

  // Fonction pour créer une facture
  async function createInvoice(customerId: string) {
	// Crée une nouvelle facture pour le client
	const invoice = await stripe.invoices.create({
	  customer: customerId, // ID du client Stripe
	  auto_advance: true, // Permet de finaliser et d'envoyer la facture automatiquement
	});

	return invoice;
  }

  // Fonction pour payer une facture
  async function payInvoice(invoiceId: string) {
	const paidInvoice = await stripe.invoices.pay(invoiceId);
	return paidInvoice;
  }


  // Fonction pour envoyer une facture
  async function sendInvoice(invoiceId: string) {
	// Envoie la facture
	const invoice = await stripe.invoices.sendInvoice(invoiceId);
	return invoice;
  }
