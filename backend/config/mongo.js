const mongoose = require('mongoose');

let isConnected = false;

async function connectMongo(uri) {
  if (isConnected) return mongoose.connection;
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/career_navigator';
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000
  });
  isConnected = true;
  console.log('✅ MongoDB connected:', mongoUri);
  return mongoose.connection;
}

module.exports = { connectMongo };
