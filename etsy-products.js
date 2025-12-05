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
    const shopName = 'BeriInk';
    
    // First, try to get the shop by name to get the numeric shop ID
    let shopId = shopName;
    let numericShopId = null;
    
    try {
      const shopUrl = `https://api.etsy.com/v3/application/shops/${shopName}`;
      console.log('Fetching shop info from:', shopUrl);
      
      const shopResponse = await fetch(shopUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (shopResponse.ok) {
        const shopData = await shopResponse.json();
        numericShopId = shopData.shop_id || shopData.results?.shop_id;
        console.log('Shop ID found:', numericShopId);
        // Use numeric ID if available, otherwise use shop name
        shopId = numericShopId || shopName;
      } else {
        console.log('Could not fetch shop by name, using shop name directly');
      }
    } catch (shopError) {
      console.log('Error fetching shop info, using shop name directly:', shopError.message);
    }
    
    // Use the correct API endpoint format from Etsy documentation
    // Fetch all active listings (limit 100 per request, can paginate if needed)
    const url = `https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=100&includes=Images,Shop`;
    
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('Using Shop ID:', shopId);
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
      
      // Get error response text first
      const errorText = await response.text();
      console.log('Error response text:', errorText);
      
      // For non-500 errors, the endpoints return a JSON object as an error response
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.log('Error data:', errorData);
      } catch (e) {
        errorData = { 
          error: 'Unknown error', 
          error_description: errorText || 'Could not parse error response',
          raw_response: errorText
        };
      }
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: `API Error: ${response.status}`,
          message: errorData.error_description || errorData.error || errorData.message || 'Unknown API error',
          details: errorData,
          shopId: shopId,
          url: url
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
    
    // Process products with full details
    const products = data.results.map((listing, index) => {
      // Price extraction
      let price = 0;
      if (listing.price && listing.price.amount) {
        price = parseFloat(listing.price.amount) / 100;
      } else if (listing.price) {
        price = parseFloat(listing.price);
      }

      // Extract all images (up to 5)
      let images = [];
      if (listing.images && Array.isArray(listing.images)) {
        images = listing.images
          .slice(0, 5)
          .map(img => img.url_570xN || img.url_fullxfull || img.url_75x75 || 'images/placeholder-temp-tattoo.jpg')
          .filter(img => img !== 'images/placeholder-temp-tattoo.jpg' || images.length === 0);
      }
      
      // Fallback to placeholder if no images
      if (images.length === 0) {
        images = ['images/placeholder-temp-tattoo.jpg'];
      }

      // Extract category/tags for filtering
      const tags = listing.tags || [];
      let category = 'Others';
      if (tags.some(tag => /animal|bird|hummingbird|swallow|toucan/i.test(tag))) {
        category = 'Animals';
      } else if (tags.some(tag => /botanical|floral|flower|rose|lily|poppy|aster|cosmos/i.test(tag))) {
        category = 'Botanical';
      } else if (tags.some(tag => /ornamental|ornament|decorative/i.test(tag))) {
        category = 'Ornamental';
      }

      // Clean description (remove HTML tags if present)
      let description = listing.description || 'Beautiful temporary tattoo design';
      if (typeof description === 'string') {
        // Remove HTML tags
        description = description.replace(/<[^>]*>/g, '');
        // Decode HTML entities
        description = description.replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      }

      return {
        id: String(listing.listing_id || `etsy-${index}`),
        title: String(listing.title || 'Temporary Tattoo'),
        description: description,
        price: price || 0,
        currency: listing.price?.currency_code || 'USD',
        images: images,
        url: String(listing.url || `https://www.etsy.com/listing/${listing.listing_id}`),
        etsy_url: String(listing.url || `https://www.etsy.com/listing/${listing.listing_id}`),
        category: category,
        quantity: 1
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