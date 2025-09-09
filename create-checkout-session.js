const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    console.log("=== CHECKOUT SESSION START ===");
    console.log("Event body:", event.body);
    
    const { items } = JSON.parse(event.body);
    console.log("Items received:", items);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No items provided" }),
      };
    }

    // Calculate shipping
    const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingAmount = orderTotal >= 3500 ? 0 : 78; // Free over $35, otherwise $0.78

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { 
          name: item.title || item.name || "Product",
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round(item.price), // price in cents
      },
      quantity: item.quantity || 1,
    }));

    // Add shipping
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { 
          name: shippingAmount === 0 ? "Free Shipping" : "Domestic Shipping",
          description: shippingAmount === 0 ? "Free shipping for orders over $35" : "3-5 business days"
        },
        unit_amount: shippingAmount,
      },
      quantity: 1,
    });

    console.log("Line items:", JSON.stringify(lineItems, null, 2));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/store.html`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE'],
      },
    });

    console.log("Session created:", session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        id: session.id, 
        url: session.url,
        success: true 
      }),
    };
  } catch (err) {
    console.error("Checkout error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: err.message,
        type: err.type || 'UnknownError'
      }),
    };
  }
};
