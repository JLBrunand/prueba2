import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
const stripe = process.env.STRIPE_SECRET_KEY?.startsWith('sk_') ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const mp = process.env.MERCADOPAGO_ACCESS_TOKEN?.length > 20 ? new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN }) : null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/checkout/stripe', async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Stripe no está configurado. Agregá STRIPE_SECRET_KEY al archivo .env.' });
    const { items = [], customer = {} } = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email,
      line_items: items.map(item => ({ price_data: { currency: 'ars', product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) }, quantity: item.quantity })),
      shipping_address_collection: { allowed_countries: ['AR'] },
      success_url: `${baseUrl}/?checkout=success`,
      cancel_url: `${baseUrl}/?checkout=cancelled`
    });
    res.json({ url: session.url });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/checkout/mercadopago', async (req, res) => {
  try {
    if (!mp) return res.status(503).json({ error: 'Mercado Pago no está configurado. Agregá MERCADOPAGO_ACCESS_TOKEN al archivo .env.' });
    const { items = [], customer = {} } = req.body;
    const preference = new Preference(mp);
    const result = await preference.create({ body: {
      items: items.map(item => ({ id: item.id, title: item.name, quantity: item.quantity, unit_price: item.price, currency_id: 'ARS' })),
      payer: { email: customer.email, name: customer.name },
      back_urls: { success: `${baseUrl}/?checkout=success`, failure: `${baseUrl}/?checkout=cancelled`, pending: `${baseUrl}/?checkout=pending` },
      auto_return: 'approved', notification_url: `${baseUrl}/api/webhooks/mercadopago`
    }});
    res.json({ url: result.init_point });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/webhooks/mercadopago', (req, res) => res.sendStatus(200));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(port, () => console.log(`BLACKOUT activo en ${baseUrl}`));
