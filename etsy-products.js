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
      
      // Try to parse error as JSON for better error messages
      let errorMessage = errorText;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorText;
      } catch (e) {
        // Keep original error text if not JSON
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `API Error: ${response.status}`,
          message: errorMessage,
          details: errorText
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
    
    // Process products with better error handling
    const products = data.results.map((listing, index) => {
      try {
        // Handle price parsing more safely
        let price = 0;
        if (listing.price && typeof listing.price === 'object') {
          price = parseFloat(listing.price.amount || 0) / 100;
        } else if (typeof listing.price === 'number') {
          price = listing.price / 100;
        } else if (typeof listing.price === 'string') {
          price = parseFloat(listing.price) / 100;
        }

        // Handle images - try to get actual images from Etsy
        let images = ['images/placeholder-temp-tattoo.jpg'];
        if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
          images = listing.images.map(img => img.url_fullxfull || img.url_570xN || img.url_75x75);
        }

        return {
          id: listing.listing_id?.toString() || `product-${index}`,
          title: listing.title || 'Temporary Tattoo',
          description: listing.description || 'Beautiful temporary tattoo design',
          price: isNaN(price) ? 0 : price,
          currency: listing.price?.currency_code || 'USD',
          images: images,
          url: listing.url || `https://www.etsy.com/listing/${listing.listing_id}`,
          quantity: 1,
          etsy_shop_url: listing.url || `https://www.etsy.com/listing/${listing.listing_id}`
        };
      } catch (error) {
        console.error(`Error processing product ${index}:`, error);
        return {
          id: `product-${index}`,
          title: 'Temporary Tattoo',
          description: 'Beautiful temporary tattoo design',
          price: 0,
          currency: 'USD',
          images: ['images/placeholder-temp-tattoo.jpg'],
          url: '#',
          quantity: 1,
          etsy_shop_url: '#'
        };
      }
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