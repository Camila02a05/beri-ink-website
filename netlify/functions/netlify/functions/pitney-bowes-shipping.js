const axios = require('axios');

// Pitney Bowes API configuration
const PITNEY_BOWES_BASE_URL = 'https://api-shipping.pitneybowes.com';
const PITNEY_BOWES_API_KEY = process.env.PITNEY_BOWES_API_KEY;

// Calculate shipping rates using Pitney Bowes
async function calculateShippingRate(shippingAddress, items) {
  try {
    // Calculate package weight and dimensions
    const totalWeight = items.length * 0.1; // 0.1 oz per temporary tattoo
    const packageWeight = Math.max(totalWeight, 0.1); // Minimum 0.1 oz
    
    // Prepare shipment data
    const shipmentData = {
      fromAddress: {
        name: "Beri Ink Tattoo",
        addressLines: ["123 Main St"], // Your business address
        city: "Los Angeles",
        stateOrProvince: "CA",
        postalCode: "90210",
        countryCode: "US"
      },
      toAddress: {
        name: shippingAddress.name,
        addressLines: [shippingAddress.address1, shippingAddress.address2].filter(Boolean),
        city: shippingAddress.city,
        stateOrProvince: shippingAddress.state,
        postalCode: shippingAddress.postal_code,
        countryCode: shippingAddress.country
      },
      parcel: {
        weight: {
          value: packageWeight,
          unit: "OZ"
        },
        dimension: {
          length: 6,
          width: 4,
          height: 0.1,
          unit: "IN"
        }
      },
      rates: [
        {
          carrier: "USPS",
          serviceId: "USPS_GROUND"
        },
        {
          carrier: "USPS", 
          serviceId: "USPS_PRIORITY"
        }
      ]
    };

    // Call Pitney Bowes API
    const response = await axios.post(
      `${PITNEY_BOWES_BASE_URL}/v1/shipments`,
      shipmentData,
      {
        headers: {
          'Authorization': `Bearer ${PITNEY_BOWES_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the cheapest rate
    const rates = response.data.rates || [];
    const cheapestRate = rates.reduce((min, rate) => 
      rate.totalCarrierCharge < min.totalCarrierCharge ? rate : min
    );

    return {
      amount: Math.round(cheapestRate.totalCarrierCharge * 100), // Convert to cents
      name: cheapestRate.serviceName,
      description: `${cheapestRate.estimatedDeliveryDays} business days`,
      trackingNumber: cheapestRate.trackingNumber
    };

  } catch (error) {
    console.error('Pitney Bowes API Error:', error.response?.data || error.message);
    
    // Fallback to flat rate if API fails
    const isInternational = shippingAddress.country !== 'US';
    return {
      amount: isInternational ? 170 : 74, // $1.70 international, $0.74 domestic (with Pitney Bowes discount)
      name: isInternational ? 'International Shipping' : 'Domestic Shipping',
      description: isInternational ? '6-20 business days' : '3-5 business days'
    };
  }
}

// Create shipping label
async function createShippingLabel(shipmentId) {
  try {
    const response = await axios.post(
      `${PITNEY_BOWES_BASE_URL}/v1/shipments/${shipmentId}/labels`,
      {
        labelFormat: "PDF",
        labelLayout: "4X6"
      },
      {
        headers: {
          'Authorization': `Bearer ${PITNEY_BOWES_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      labelUrl: response.data.labelUrl,
      trackingNumber: response.data.trackingNumber
    };

  } catch (error) {
    console.error('Pitney Bowes Label Creation Error:', error.response?.data || error.message);
    throw new Error('Failed to create shipping label');
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
    const { action, shippingAddress, items, shipmentId } = JSON.parse(event.body);

    if (action === 'calculate') {
      // Calculate shipping rate
      const shippingRate = await calculateShippingRate(shippingAddress, items);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify(shippingRate)
      };

    } else if (action === 'createLabel') {
      // Create shipping label
      const labelData = await createShippingLabel(shipmentId);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify(labelData)
      };

    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action' })
      };
    }

  } catch (error) {
    console.error('Pitney Bowes Function Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
