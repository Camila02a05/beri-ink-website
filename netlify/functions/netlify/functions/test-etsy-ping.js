exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const apiKey = 'pxqb8kr9sivd7fyemn37vnru';
    
    // Test the ping endpoint first (doesn't require OAuth)
    const response = await fetch('https://api.etsy.com/v3/application/openapi-ping', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'API key is working',
          data: data
        })
      };
    } else {
      const errorData = await response.json();
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `API Error: ${response.status}`,
          message: errorData.error_description || errorData.error || 'API key test failed',
          details: errorData
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Function execution failed'
      })
    };
  }
};
