# BLACKOUT Store

Tienda urbana de gorras para Argentina, con catálogo, carrito, checkout y panel administrativo preparado para integrar pagos reales.

## Ejecutar localmente

```bash
npm install
cp .env.example .env
npm start
```

Abrí `http://localhost:3000`.

## Pagos reales

El checkout usa dos rutas seguras del servidor:

- `POST /api/checkout/mercadopago` — crea una preferencia de Mercado Pago.
- `POST /api/checkout/stripe` — crea una sesión de Stripe Checkout.

Completá en `.env` las credenciales del entorno correspondiente (`MERCADOPAGO_ACCESS_TOKEN` y `STRIPE_SECRET_KEY`) y definí `BASE_URL` con la URL pública del deploy. Nunca expongas estas claves en el frontend.

## Incluye

- Diseño responsive negro/plateado sin imágenes de stock ni imágenes temporales.
- Catálogo filtrable, ordenamiento y fichas de producto.
- Carrito persistente en `localStorage`.
- Checkout con datos de envío, envío gratis desde $100.000 y Correo Argentino como tarifa fija.
- Mercado Pago y Stripe mediante backend.
- Secciones de marca, manifiesto, beneficios, FAQ y newsletter.

> Nota: el panel administrativo y la gestión persistente de pedidos requieren conectar una base de datos y autenticación antes de usarlo en producción. Las credenciales de pago deben configurarse en el servidor.
