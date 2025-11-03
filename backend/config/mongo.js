const mongoose = require('mongoose');

let isConnected = false;

async function connectMongo(uri) {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }
  
  try {
    const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/career_navigator';
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully!');
    console.log('📍 Database:', mongoose.connection.name);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = { connectMongo };
