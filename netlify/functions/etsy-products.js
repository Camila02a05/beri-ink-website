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
    
    // Get shop ID from a listing
    const listingId = 4344167315;
    let shopId = null;
    
    // First, get the shop_id from the listing
    try {
      const listingUrl = `https://api.etsy.com/v3/application/listings/${listingId}`;
      console.log('Getting shop ID from listing:', listingUrl);
      
      const listingResponse = await fetch(listingUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (listingResponse.ok) {
        const listingData = await listingResponse.json();
        console.log('Listing response:', JSON.stringify(listingData, null, 2));
        
        // Extract shop_id from listing
        if (listingData.shop_id) {
          shopId = listingData.shop_id;
        } else if (listingData.results && listingData.results.shop_id) {
          shopId = listingData.results.shop_id;
        }
        
        if (shopId) {
          console.log('Found shop ID from listing:', shopId);
        } else {
          console.log('Could not find shop_id in listing response');
        }
      } else {
        const errorText = await listingResponse.text();
        console.log('Failed to get listing:', listingResponse.status, errorText);
      }
    } catch (listingError) {
      console.log('Error getting listing:', listingError.message);
    }
    
    // If we couldn't get shop ID, use fallback
    if (!shopId) {
      shopId = 1757203351; // Fallback
      console.log('Using fallback shop ID:', shopId);
    }
    
    // Verify it's a number
    if (typeof shopId !== 'number') {
      throw new Error(`Shop ID must be a number, got ${typeof shopId}: ${shopId}`);
    }
    
    console.log('Using shop ID:', shopId, 'Type:', typeof shopId);
    
    // Use the correct API endpoint format from Etsy documentation
    // Fetch all active listings (limit 100 per request, can paginate if needed)
    // Request Images to be included in the response
    const url = `https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=100&includes=Images`;
    
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
      
      // If 404, the shop ID might be wrong
      if (response.status === 404) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            error: `Shop not found (404)`,
            message: `The shop ID ${shopId} was not found. This might not be your correct shop ID. Please verify your shop ID from your Etsy account.`,
            details: errorData,
            shopId: shopId,
            url: url,
            help: 'To find your shop ID: 1) Check your Etsy shop settings URL, 2) Look in your Etsy API dashboard, or 3) Contact Etsy support'
          })
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
    console.log('=== FULL API RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('=== RESPONSE ANALYSIS ===');
    console.log('Response type:', typeof data);
    console.log('Response keys:', Object.keys(data));
    console.log('Has results property?', 'results' in data);
    console.log('Results type:', typeof data.results);
    console.log('Results is array?', Array.isArray(data.results));
    console.log('Results count:', data.results ? data.results.length : 'N/A');
    
    if (data.results && data.results.length > 0) {
      console.log('First result:', JSON.stringify(data.results[0], null, 2));
    } else {
      console.log('No results in response');
      console.log('Full data structure:', data);
    }
    
    if (!data || !data.results) {
      console.error('Invalid response structure:', data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid response structure',
          message: 'No results found in API response',
          debug: {
            hasData: !!data,
            hasResults: !!data?.results,
            dataKeys: data ? Object.keys(data) : [],
            fullResponse: data
          }
        })
      };
    }
    
    if (data.results.length === 0) {
      console.log('No listings found for this shop');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          products: [],
          count: 0,
          message: 'No active listings found for this shop',
          shopId: shopId
        })
      };
    }
    
    // Check if images are in a separate includes section
    const imagesByListingId = {};
    if (data.Includes && data.Includes.Images) {
      console.log('Found Images in Includes section');
      data.Includes.Images.forEach(img => {
        if (img.listing_id) {
          if (!imagesByListingId[img.listing_id]) {
            imagesByListingId[img.listing_id] = [];
          }
          imagesByListingId[img.listing_id].push(img);
        }
      });
      console.log('Images by listing ID:', Object.keys(imagesByListingId).length, 'listings have images');
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
      // Etsy API v3 can return images in different structures
      let images = [];
      
      // Method 1: Check if images are in listing.images array
      if (listing.images && Array.isArray(listing.images)) {
        images = listing.images
          .slice(0, 5)
          .map(img => {
            // Handle different image object structures
            if (typeof img === 'string') return img;
            return img.url_570xN || img.url_fullxfull || img.url_75x75 || img.url || null;
          })
          .filter(img => img && img !== 'images/placeholder-temp-tattoo.jpg');
      }
      
      // Method 2: Check if images are in Images (capital I) from includes
      if (images.length === 0 && listing.Images && Array.isArray(listing.Images)) {
        images = listing.Images
          .slice(0, 5)
          .map(img => {
            if (typeof img === 'string') return img;
            return img.url_570xN || img.url_fullxfull || img.url_75x75 || img.url || null;
          })
          .filter(img => img && img !== 'images/placeholder-temp-tattoo.jpg');
      }
      
      // Method 3: Check if there's a single image URL
      if (images.length === 0 && listing.image_url) {
        images = [listing.image_url];
      }
      
      // Method 4: Check if images are in a nested structure
      if (images.length === 0 && listing.images && typeof listing.images === 'object' && !Array.isArray(listing.images)) {
        // Try to extract from object structure
        const imageObj = listing.images;
        if (imageObj.url_570xN) images.push(imageObj.url_570xN);
        else if (imageObj.url_fullxfull) images.push(imageObj.url_fullxfull);
        else if (imageObj.url) images.push(imageObj.url);
      }
      
      // Method 5: Check includes section for images
      if (images.length === 0 && listing.listing_id && imagesByListingId[listing.listing_id]) {
        images = imagesByListingId[listing.listing_id]
          .slice(0, 5)
          .map(img => img.url_570xN || img.url_fullxfull || img.url_75x75 || img.url || null)
          .filter(img => img);
      }
      
      // Log for debugging first product
      if (index === 0) {
        console.log('=== IMAGE EXTRACTION DEBUG ===');
        console.log('Listing ID:', listing.listing_id);
        console.log('Has listing.images?', !!listing.images);
        console.log('listing.images type:', typeof listing.images);
        console.log('listing.images is array?', Array.isArray(listing.images));
        console.log('Has listing.Images?', !!listing.Images);
        console.log('Extracted images:', images);
        console.log('Full listing object keys:', Object.keys(listing));
      }
      
      // Fallback to placeholder if no images
      if (images.length === 0) {
        images = ['images/placeholder-temp-tattoo.jpg'];
      }

      // Extract category - use Etsy's category if available, otherwise detect from tags
      let category = 'Others';
      
      // First, check if Etsy provides a category directly
      if (listing.category_path && listing.category_path.length > 0) {
        const categoryPath = listing.category_path[listing.category_path.length - 1];
        // Map Etsy categories to our categories
        if (/botanical|floral|flower/i.test(categoryPath)) {
          category = 'Botanical';
        } else if (/animal|bird/i.test(categoryPath)) {
          category = 'Animals';
        } else if (/ornamental|ornament/i.test(categoryPath)) {
          category = 'Ornamental';
        } else if (/halloween|spooky|scary/i.test(categoryPath)) {
          category = 'Halloween';
        }
      }
      
      // If no category from Etsy, detect from tags
      if (category === 'Others') {
        const tags = listing.tags || [];
        if (tags.some(tag => /animal|bird|hummingbird|swallow|toucan/i.test(tag))) {
          category = 'Animals';
        } else if (tags.some(tag => /botanical|floral|flower|rose|lily|poppy|aster|cosmos/i.test(tag))) {
          category = 'Botanical';
        } else if (tags.some(tag => /halloween|spooky|scary|pumpkin|ghost|witch/i.test(tag))) {
          category = 'Halloween';
        } else if (tags.some(tag => /ornamental|ornament|decorative/i.test(tag))) {
          category = 'Ornamental';
        }
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