exports.handler = async (event, context) => {
  console.log('Test checkout function called');
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: 'Test checkout function is working',
      timestamp: new Date().toISOString()
    })
  };
};
