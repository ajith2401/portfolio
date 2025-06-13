// src/lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Debug logging
  console.log('🔍 MONGODB_URI exists:', !!MONGODB_URI);
  console.log('🔗 Connection target:', MONGODB_URI?.split('@')[1]?.split('?')[0]);
  
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,          // 45 seconds socket timeout
      connectTimeoutMS: 10000,         // 10 seconds connect timeout
      family: 4,                       // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority'
    };

    mongoose.set('strictQuery', true);
    
    console.log('🚀 Attempting MongoDB connection...');
    console.log('⏱️ Timeout settings: serverSelection=10s, socket=45s, connect=10s');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Successfully connected to MongoDB');
        console.log('📊 Connection state:', mongoose.connection.readyState);
        console.log('🏷️ Database name:', mongoose.connection.name);
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        
        // Enhanced error logging
        if (error.code === 'ETIMEOUT') {
          console.error('🕐 DNS/Connection timeout - Check Atlas cluster status and network');
        } else if (error.code === 'EAUTH') {
          console.error('🔑 Authentication failed - Check username/password');
        } else if (error.code === 'ECONNREFUSED') {
          console.error('🚫 Connection refused - Check IP whitelist');
        }
        
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('💥 Final connection attempt failed');
    console.error('🔍 Error details:', {
      message: e.message,
      code: e.code,
      syscall: e.syscall,
      hostname: e.hostname
    });
    throw e;
  }
}

// Add connection event listeners for better debugging
mongoose.connection.on('connected', () => {
  console.log('🎉 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

export default connectDB;