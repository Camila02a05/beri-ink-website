const axios = require('axios');

// Print shipping label for an order
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { orderId, shipmentId } = JSON.parse(event.body);

    if (!orderId || !shipmentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Order ID and Shipment ID are required' })
      };
    }

    // Call Pitney Bowes to create and get the label
    const pitneyBowesResponse = await fetch(`${process.env.URL}/.netlify/functions/pitney-bowes-shipping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createLabel',
        shipmentId: shipmentId
      })
    });

    if (!pitneyBowesResponse.ok) {
      throw new Error('Failed to create shipping label');
    }

    const labelData = await pitneyBowesResponse.json();

    // Update order status in localStorage (in a real app, this would be in a database)
    // For now, we'll just return the label data

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        labelUrl: labelData.labelUrl,
        trackingNumber: labelData.trackingNumber,
        message: `Shipping label created for order #${orderId}`
      })
    };

  } catch (error) {
    console.error('Print Label Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Failed to print shipping label',
        message: error.message 
      })
    };
  }
};
