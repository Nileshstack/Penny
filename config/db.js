const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('Connected to MongoDB');
};

module.exports = connectDB;
