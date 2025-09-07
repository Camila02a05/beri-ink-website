const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Helper function to calculate shipping
async function calculateShipping(address, items) {
  const isInternational = address.country !== 'US';
  
  // Calculate total order value
  const orderTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const orderTotalDollars = orderTotal / 100;
  
  if (isInternational) {
    return {
      amount: 170, // $1.70 in cents
      name: 'International Shipping',
      description: '6-20 business days'
    };
  } else {
    // Check for free shipping threshold ($35)
    if (orderTotalDollars >= 35) {
      return {
        amount: 0, // Free shipping
        name: 'Free Shipping',
        description: 'Free shipping for orders over $35'
      };
    } else {
      // Domestic shipping - use Pitney Bowes for accurate rates
      try {
        const axios = require('axios');
        const pitneyBowesResponse = await axios.post(`${process.env.URL}/.netlify/functions/pitney-bowes-shipping`, {
          action: 'calculate',
          shippingAddress: address,
          items: items
        });
        
        if (pitneyBowesResponse.status === 200) {
          return pitneyBowesResponse.data;
        }
      } catch (error) {
        console.error('Pitney Bowes integration failed:', error);
      }
      
      // Fallback to flat rate if Pitney Bowes fails
      return {
        amount: 78, // $0.78 in cents
        name: 'Domestic Shipping',
        description: '3-5 business days'
      };
    }
  }
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { items, shippingAddress } = JSON.parse(event.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No items provided' })
      };
    }

    // Calculate shipping
    const shipping = await calculateShipping(shippingAddress, items);

    // Create line items for products
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.image],
          metadata: {
            sku: item.sku || '',
            variation: item.variation || ''
          }
        },
        unit_amount: item.price, // Price in cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: shipping.name,
          description: shipping.description
        },
        unit_amount: shipping.amount,
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/store.html`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'CZ', 'HU', 'PL', 'RO', 'BG', 'HR', 'JP', 'KR', 'SG', 'HK', 'TW', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'VE', 'ZA', 'EG', 'MA', 'TN', 'DZ', 'LY', 'SD', 'ET', 'KE', 'UG', 'TZ', 'GH', 'NG', 'ZA', 'IN', 'PK', 'BD', 'LK', 'NP', 'BT', 'MV', 'ID', 'MY', 'TH', 'VN', 'PH', 'KH', 'LA', 'MM', 'BN', 'TL', 'CN', 'RU', 'KZ', 'UZ', 'KG', 'TJ', 'TM', 'AF', 'IR', 'IQ', 'SY', 'LB', 'JO', 'IL', 'PS', 'SA', 'AE', 'QA', 'BH', 'KW', 'OM', 'YE', 'TR', 'GE', 'AM', 'AZ', 'BY', 'MD', 'UA', 'MN', 'KP'],
      },
      metadata: {
        items: JSON.stringify(items),
        shipping: JSON.stringify(shipping)
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' })
    };
  }
};