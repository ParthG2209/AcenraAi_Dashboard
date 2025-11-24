const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI_BASE = process.env.MONGO_URI_BASE || 'mongodb://localhost:27017/';
    const DB_NAME = process.env.DB_NAME || 'acenra_dashboard';
    
    const mongoURI = `${MONGO_URI_BASE}${DB_NAME}`;
    
    // newer mongoose versions don't need the old options
    await mongoose.connect(mongoURI);
    
    console.log(`MongoDB connected: ${DB_NAME}`);
    console.log(`URI: ${MONGO_URI_BASE}${DB_NAME}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // just crash if db won't connect
  }
};

// log if connection drops
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

module.exports = connectDB;