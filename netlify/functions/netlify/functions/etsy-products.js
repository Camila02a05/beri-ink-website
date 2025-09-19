exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Starting Etsy products fetch...');
    
    const apiKey = 'pxqb8kr9sivd7fyemn37vnru';
    const shopId = 'BeriInk';
    
    // Use the correct API endpoint format from Etsy documentation
    const url = `https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=12`;
    
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.log('Response status:', response.status, response.statusText);
      
      // For non-500 errors, the endpoints return a JSON object as an error response
      let errorData;
      try {
        errorData = await response.json();
        console.log('Error data:', errorData);
      } catch (e) {
        errorData = { error: 'Unknown error', error_description: 'Could not parse error response' };
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `API Error: ${response.status}`,
          message: errorData.error_description || errorData.error || 'Unknown API error',
          details: errorData
        })
      };
    }
    
    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    if (!data || !data.results) {
      console.error('Invalid response structure:', data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid response structure',
          message: 'No results found in API response'
        })
      };
    }
    
    // Process products with minimal error handling
    const products = data.results.map((listing, index) => {
      // Simple price extraction
      let price = 0;
      if (listing.price && listing.price.amount) {
        price = parseFloat(listing.price.amount) / 100;
      }

      // Simple image extraction
      let images = ['images/placeholder-temp-tattoo.jpg'];
      if (listing.images && listing.images[0] && listing.images[0].url_570xN) {
        images = [listing.images[0].url_570xN];
      }

      return {
        id: String(listing.listing_id || index),
        title: String(listing.title || 'Temporary Tattoo'),
        description: String(listing.description || 'Beautiful temporary tattoo design'),
        price: price || 0,
        currency: 'USD',
        images: images,
        url: String(listing.url || `https://www.etsy.com/listing/${listing.listing_id}`),
        quantity: 1,
        etsy_shop_url: String(listing.url || `https://www.etsy.com/listing/${listing.listing_id}`)
      };
    });
    
    console.log('Processed products:', products.length);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        products: products,
        count: products.length
      })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Function execution failed',
        stack: error.stack
      })
    };
  }
};