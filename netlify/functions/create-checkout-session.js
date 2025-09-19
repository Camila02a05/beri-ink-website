exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { items, customerInfo } = JSON.parse(event.body);
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'No items provided'
        })
      };
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = total >= 35 ? 0 : 5.99; // Free shipping over $35
    const tax = total * 0.08; // 8% tax
    const finalTotal = total + shipping + tax;

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.description,
          images: item.images
        },
        unit_amount: Math.round(item.price * 100) // Convert to cents
      },
      quantity: item.quantity
    }));

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping'
          },
          unit_amount: Math.round(shipping * 100)
        },
        quantity: 1
      });
    }

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
            description: 'Sales tax'
          },
          unit_amount: Math.round(tax * 100)
        },
        quantity: 1
      });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/store.html`,
      customer_email: customerInfo?.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA']
      },
      metadata: {
        order_type: 'etsy_products',
        items: JSON.stringify(items)
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};