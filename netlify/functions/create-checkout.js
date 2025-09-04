'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { items } = JSON.parse(event.body || '{}');
    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: 'No items provided' };
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.title },
        unit_amount: item.price, // cents
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: 'https://beri-ink.com/thank-you.html',
      cancel_url: 'https://beri-ink.com/store.html',
      automatic_tax: { enabled: false },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};


