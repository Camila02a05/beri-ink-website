exports.handler = async (event, context) => {
  console.log('=== DEBUG CHECKOUT FUNCTION ===');
  console.log('Event method:', event.httpMethod);
  console.log('Event body:', event.body);
  console.log('Environment variables:');
  console.log('- STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  console.log('- STRIPE_SECRET_KEY starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));
  console.log('- URL exists:', !!process.env.URL);
  console.log('- URL value:', process.env.URL);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Debug function working',
      method: event.httpMethod,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasUrl: !!process.env.URL,
      timestamp: new Date().toISOString()
    })
  };
};

