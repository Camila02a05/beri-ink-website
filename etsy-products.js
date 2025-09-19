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
    
    // Use a simpler API call without complex parameters
    const url = `https://openapi.etsy.com/v3/application/shops/${shopId}/listings/active?api_key=${apiKey}&limit=12`;
    
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `API Error: ${response.status}`,
          message: errorText
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
      return {
        id: listing.listing_id || `product-${index}`,
        title: listing.title || 'Temporary Tattoo',
        description: 'Beautiful temporary tattoo design',
        price: parseFloat(listing.price?.amount || 0) / 100,
        currency: listing.price?.currency_code || 'USD',
        images: ['images/placeholder-temp-tattoo.jpg'], // Use placeholder for now
        url: listing.url || `https://www.etsy.com/listing/${listing.listing_id}`,
        quantity: 1,
        etsy_shop_url: listing.url || `https://www.etsy.com/listing/${listing.listing_id}`
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