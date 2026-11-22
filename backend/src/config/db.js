const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
