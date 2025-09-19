exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const apiKey = 'pxqb8kr9sivd7fyemn37vnru';
    const shopId = 'BeriInk';
    
    // Test basic shop access
    const response = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}?api_key=${apiKey}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: response.status,
        ok: response.ok,
        message: 'Etsy API test completed'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        message: 'Etsy API test failed'
      })
    };
  }
};

