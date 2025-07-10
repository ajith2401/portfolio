// src/lib/db.js
import mongoose from 'mongoose';

// Cache the connection to avoid creating multiple connections
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global variable to store the cached connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connection options for better performance and reliability (UPDATED: removed deprecated options)
const connectionOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true
  // 'w' removed for compatibility with ConnectOptions
};

async function connectDB() {
  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a promise, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      
      // Set up connection event listeners
      setupConnectionEventListeners(mongoose.connection);
      
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Set up event listeners for connection monitoring
function setupConnectionEventListeners(connection) {
  // Connection events
  connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB');
  });

  connection.on('error', (error) => {
    console.error('❌ Mongoose connection error:', error);
  });

  connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
  });

  // Graceful connection close on app termination
  process.on('SIGINT', async () => {
    try {
      await connection.close();
      console.log('🔒 Mongoose connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    connection.on('open', () => {
      console.log('🚀 MongoDB connection opened in development mode');
    });
  }
}

// Health check function for API monitoring
export async function checkDatabaseHealth() {
  try {
    const connection = await connectDB();
    
    // Perform a simple operation to check connectivity
    const adminDb = connection.connection.db.admin();
    const result = await adminDb.ping();
    
    return {
      status: 'healthy',
      connected: connection.connection.readyState === 1,
      ping: result.ok === 1,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      connected: false,
      timestamp: new Date().toISOString()
    };
  }
}

// Connection retry logic with exponential backoff
export async function connectWithRetry(maxRetries = 5) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const connection = await connectDB();
      return connection;
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        console.error(`❌ Failed to connect to MongoDB after ${maxRetries} attempts`);
        throw error;
      }
      
      const delay = Math.min(1000 * Math.pow(2, retries), 10000); // Max 10 seconds
      console.log(`⏳ MongoDB connection attempt ${retries} failed. Retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Close connection (useful for testing)
export async function closeConnection() {
  try {
    if (cached.conn) {
      await cached.conn.connection.close();
      cached.conn = null;
      cached.promise = null;
      console.log('🔒 MongoDB connection closed manually');
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
}

// Get connection statistics
export function getConnectionStats() {
  if (!cached.conn) {
    return { connected: false, readyState: 0 };
  }

  const connection = cached.conn.connection;
  
  return {
    connected: connection.readyState === 1,
    readyState: connection.readyState,
    readyStateString: getReadyStateString(connection.readyState),
    host: connection.host,
    port: connection.port,
    name: connection.name,
    collections: Object.keys(connection.collections),
    models: Object.keys(connection.models)
  };
}

// Helper function to get readable connection state
function getReadyStateString(readyState) {
  const states = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[readyState] || 'unknown';
}

export default connectDB;