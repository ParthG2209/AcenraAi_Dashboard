const mongoose = require('mongoose');

/**
 * Connect to MongoDB using local instance via MongoDB Compass
 * Uses base URI with configurable database name from environment variables
 */
const connectDB = async () => {
  try {
    const MONGO_URI_BASE = process.env.MONGO_URI_BASE || 'mongodb://localhost:27017/';
    const DB_NAME = process.env.DB_NAME || 'acenra_dashboard';
    
    // Construct full MongoDB URI
    const mongoURI = `${MONGO_URI_BASE}${DB_NAME}`;
    
    // Connect to MongoDB (options removed - not needed in v4.0.0+)
    await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB connected successfully to database: ${DB_NAME}`);
    console.log(`📍 Connection URI: ${MONGO_URI_BASE}${DB_NAME}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

module.exports = connectDB;