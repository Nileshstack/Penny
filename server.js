require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./middleware/ApiError');

const app = express();
let server;
let startupPromise;

const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new ApiError(403, 'Origin is not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/transections', require('./routes/transectionRoutes'));

app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});
app.use(errorHandler);

function validateEnvironment() {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is required');
  }
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is required');
  }
  if (process.env.NODE_ENV === 'production' && process.env.JWT_KEY.length < 32) {
    throw new Error('JWT_KEY must contain at least 32 characters in production');
  }
}

async function startServer() {
  if (server) {
    return server;
  }
  if (!startupPromise) {
    startupPromise = (async () => {
      validateEnvironment();
      await connectDB();
      const port = Number(process.env.PORT) || 8080;
      server = app.listen(port, '0.0.0.0', () => {
        console.log(`PennyPilot API listening on port ${port}`);
      });
      return server;
    })();
  }
  return startupPromise;
}

if (require.main === module) {
  startServer().catch(() => {
    console.error('Server startup failed. Check MONGO_URL, JWT_KEY, and database availability.');
    process.exitCode = 1;
  });
}

module.exports = { app, startServer, validateEnvironment };
