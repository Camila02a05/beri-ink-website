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
    const apiKey = 'pxqb8kr9sivd7fyemn37vnru';
    const shopId = 'BeriInk';
    const baseUrl = 'https://openapi.etsy.com/v3';

    console.log('Fetching Etsy products for shop:', shopId);

    // First, let's try a simple test to see if the API key works
    const testResponse = await fetch(
      `${baseUrl}/application/shops/${shopId}?api_key=${apiKey}`
    );

    console.log('Test API response status:', testResponse.status);

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('Etsy API test error:', testResponse.status, errorText);
      throw new Error(`Etsy API test failed: ${testResponse.status} - ${errorText}`);
    }

    const testData = await testResponse.json();
    console.log('Shop info:', testData);

    // Now fetch the listings
    const listingsResponse = await fetch(
      `${baseUrl}/application/shops/${shopId}/listings/active?api_key=${apiKey}&limit=20`
    );

    console.log('Listings API response status:', listingsResponse.status);

    if (!listingsResponse.ok) {
      const errorText = await listingsResponse.text();
      console.error('Etsy listings API error:', listingsResponse.status, errorText);
      throw new Error(`Etsy listings API error: ${listingsResponse.status} - ${errorText}`);
    }

    const listingsData = await listingsResponse.json();
    console.log('Listings response received:', listingsData);

    if (!listingsData.results || !Array.isArray(listingsData.results)) {
      console.error('Invalid listings response:', listingsData);
      throw new Error('Invalid response format from Etsy listings API');
    }

    // Process the listings with better error handling
    const products = [];
    
    for (const listing of listingsData.results) {
      try {
        // Get images for this listing
        let images = [];
        try {
          const imagesResponse = await fetch(
            `${baseUrl}/application/listings/${listing.listing_id}/images?api_key=${apiKey}`
          );
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            images = imagesData.results || [];
          }
        } catch (imgError) {
          console.warn('Failed to fetch images for listing:', listing.listing_id, imgError);
        }

        const product = {
          id: listing.listing_id,
          title: listing.title || 'Untitled Product',
          description: stripHtml(listing.description || ''),
          price: parseFloat(listing.price?.amount || 0) / 100,
          currency: listing.price?.currency_code || 'USD',
          images: images.map(img => img.url_fullxfull || img.url_570xN || img.url_75x75).filter(Boolean),
          url: listing.url || `https://www.etsy.com/listing/${listing.listing_id}`,
          quantity: 1,
          tags: listing.tags || [],
          materials: listing.materials || [],
          views: listing.views || 0,
          num_favorers: listing.num_favorers || 0,
          etsy_shop_url: listing.url || `https://www.etsy.com/listing/${listing.listing_id}`
        };

        // Add a default image if none available
        if (product.images.length === 0) {
          product.images = ['images/placeholder-temp-tattoo.jpg'];
        }

        products.push(product);
      } catch (productError) {
        console.warn('Failed to process listing:', listing.listing_id, productError);
        // Continue with other products
      }
    }

    console.log('Successfully processed products:', products.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        products: products,
        count: products.length,
        shop_id: shopId
      })
    };

  } catch (error) {
    console.error('Error fetching Etsy products:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to fetch products from Etsy',
        details: error.toString()
      })
    };
  }
};

// Helper function to strip HTML
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}