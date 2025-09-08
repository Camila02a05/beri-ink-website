const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('=== CHECKOUT FUNCTION STARTED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Event method:', event.httpMethod);
    console.log('Event headers:', JSON.stringify(event.headers, null, 2));
    
    // Environment checks
    console.log('Environment variables check:');
    console.log('- STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('- STRIPE_SECRET_KEY starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));
    console.log('- URL exists:', !!process.env.URL);
    console.log('- URL value:', process.env.URL);

    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
      console.log('Parsed request body:', JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message 
        })
      };
    }

    const { items } = requestBody;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items:', items);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No valid items provided' })
      };
    }

    console.log('Processing', items.length, 'items');

    // Calculate order total and shipping
    const orderTotal = items.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      console.log(`Item: ${item.title}, Price: ${item.price}, Qty: ${item.quantity}, Total: ${itemTotal}`);
      return sum + itemTotal;
    }, 0);

    console.log('Order total (cents):', orderTotal);
    console.log('Order total (dollars):', orderTotal / 100);

    // Simple shipping calculation: Free over $35, otherwise $0.78
    const shippingAmount = orderTotal >= 3500 ? 0 : 78;
    console.log('Shipping amount (cents):', shippingAmount);

    // Create line items for Stripe
    const lineItems = [];

    // Add product line items
    items.forEach((item, index) => {
      const lineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title || `Product ${index + 1}`,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.max(1, Math.round(item.price || 0)), // Ensure positive integer
        },
        quantity: Math.max(1, Math.round(item.quantity || 1)), // Ensure positive integer
      };
      
      console.log(`Line item ${index + 1}:`, JSON.stringify(lineItem, null, 2));
      lineItems.push(lineItem);
    });

    // Add shipping line item
    const shippingLineItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: shippingAmount === 0 ? 'Free Shipping' : 'Domestic Shipping',
          description: shippingAmount === 0 ? 'Free shipping for orders over $35' : '3-5 business days',
        },
        unit_amount: shippingAmount,
      },
      quantity: 1,
    };
    
    console.log('Shipping line item:', JSON.stringify(shippingLineItem, null, 2));
    lineItems.push(shippingLineItem);

    // Prepare Stripe session parameters
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/store.html`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE'],
      },
      metadata: {
        order_total: orderTotal.toString(),
        shipping_amount: shippingAmount.toString(),
        item_count: items.length.toString()
      }
    };

    console.log('Creating Stripe session with params:', JSON.stringify(sessionParams, null, 2));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('Stripe session created successfully:');
    console.log('- Session ID:', session.id);
    console.log('- Session URL:', session.url);
    console.log('- Session status:', session.status);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        success: true
      })
    };

  } catch (error) {
    console.error('=== CHECKOUT ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error type (Stripe):', error.type);
    console.error('Error stack:', error.stack);

    // Handle specific Stripe errors
    let errorMessage = 'Checkout failed';
    let statusCode = 500;

    if (error.type === 'StripeCardError') {
      errorMessage = 'Card error: ' + error.message;
      statusCode = 400;
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid request: ' + error.message;
      statusCode = 400;
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Stripe API error: ' + error.message;
      statusCode = 502;
    } else if (error.type === 'StripeConnectionError') {
      errorMessage = 'Network error: ' + error.message;
      statusCode = 503;
    } else if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Authentication error: Check Stripe keys';
      statusCode = 401;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        message: error.message,
        type: error.type || 'UnknownError',
        success: false,
        timestamp: new Date().toISOString()
      })
    };
  }
};

