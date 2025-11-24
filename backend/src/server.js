require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const deviceRoutes = require('./routes/deviceRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// connect to mongo first
connectDB();

// basic middleware
app.use(cors()); // TODO: lock this down for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn off caching - was having issues with stale data
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// simple logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// routes
app.get('/', (req, res) => {
  res.json({
    message: 'Acenra Dashboard API',
    version: '1.0.0',
    endpoints: {
      devices: '/devices',
      health: '/health',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/devices', deviceRoutes);

// 404 and error handlers (keep at end)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}`);
});