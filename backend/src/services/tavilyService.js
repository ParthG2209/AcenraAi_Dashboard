const axios = require('axios');

const TAVILY_API_URL = 'https://api.tavily.com/search';

// call Tavily API to search for stuff
const searchTavily = async (query) => {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    
    if (!apiKey) {
      throw new Error('Tavily API key not set in environment');
    }

    const response = await axios.post(
      TAVILY_API_URL,
      {
        api_key: apiKey,
        query: query,
        search_depth: 'basic', // just quick search
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds
      }
    );

    return response.data;
  } catch (error) {
    console.error('Tavily API error:', error.message);
    
    if (error.response) {
      // got response but it's an error
      throw new Error(`Tavily API error: ${error.response.data?.error || error.response.statusText}`);
    } else if (error.request) {
      // no response at all
      throw new Error('No response from Tavily API - check connection');
    } else {
      throw new Error(error.message);
    }
  }
};

// clean up the Tavily response for frontend
const formatTavilyResponse = (tavilyData, deviceId, query) => {
  const results = tavilyData.results || [];
  
  return {
    deviceId,
    query,
    answer: tavilyData.answer || 'No answer found',
    topResults: results.map((result) => ({
      title: result.title || 'No title',
      url: result.url || '',
      snippet: result.content || result.snippet || 'No content available',
      score: result.score || 0,
    })),
    responseTime: tavilyData.response_time || null,
  };
};

module.exports = {
  searchTavily,
  formatTavilyResponse,
};