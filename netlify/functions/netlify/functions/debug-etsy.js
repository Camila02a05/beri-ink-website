exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const apiKey = 'pxqb8kr9sivd7fyemn37vnru';
    const shopId = 'BeriInk';
    
    console.log('Testing Etsy API with debug info...');
    
    // Test 1: Ping endpoint
    console.log('Testing ping endpoint...');
    const pingResponse = await fetch('https://api.etsy.com/v3/application/openapi-ping', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    const pingData = await pingResponse.text();
    console.log('Ping response status:', pingResponse.status);
    console.log('Ping response:', pingData);
    
    // Test 2: Shop info
    console.log('Testing shop info...');
    const shopResponse = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    const shopData = await shopResponse.text();
    console.log('Shop response status:', shopResponse.status);
    console.log('Shop response:', shopData);
    
    // Test 3: Listings
    console.log('Testing listings...');
    const listingsResponse = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=5`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    const listingsData = await listingsResponse.text();
    console.log('Listings response status:', listingsResponse.status);
    console.log('Listings response:', listingsData);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        debug: {
          ping: {
            status: pingResponse.status,
            data: pingData
          },
          shop: {
            status: shopResponse.status,
            data: shopData
          },
          listings: {
            status: listingsResponse.status,
            data: listingsData
          }
        }
      })
    };
    
  } catch (error) {
    console.error('Debug error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
