const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const sig = event.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webhook signature verification failed' })
      };
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log('Payment successful for session:', session.id);
        
        // Here you could:
        // - Send confirmation email
        // - Update inventory
        // - Create order record
        // - Send to fulfillment system
        
        break;
      
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', stripeEvent.data.object.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    };
  }
};
