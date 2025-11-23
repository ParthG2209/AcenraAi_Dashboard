const axios = require('axios');

/**
 * Tavily Search API Service
 * Handles all external search requests to Tavily API
 * API key is kept server-side only for security
 */

const TAVILY_API_URL = 'https://api.tavily.com/search';

/**
 * Search Tavily API for device information
 * @param {string} query - Search query string
 * @returns {Promise<Object>} Search results
 */
const searchTavily = async (query) => {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    
    if (!apiKey) {
      throw new Error('Tavily API key is not configured');
    }

    // Make request to Tavily Search API
    const response = await axios.post(
      TAVILY_API_URL,
      {
        api_key: apiKey,
        query: query,
        search_depth: 'basic',
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('Tavily API Error:', error.message);
    
    if (error.response) {
      // API returned an error response
      throw new Error(`Tavily API error: ${error.response.data?.error || error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from Tavily API. Please check your connection.');
    } else {
      // Error in request setup
      throw new Error(error.message);
    }
  }
};

/**
 * Format Tavily response for frontend consumption
 * @param {Object} tavilyData - Raw Tavily API response
 * @param {string} deviceId - Device ID for reference
 * @param {string} query - Original query
 * @returns {Object} Formatted response
 */
const formatTavilyResponse = (tavilyData, deviceId, query) => {
  const results = tavilyData.results || [];
  
  return {
    deviceId,
    query,
    answer: tavilyData.answer || 'No answer available',
    topResults: results.map((result) => ({
      title: result.title || 'Untitled',
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