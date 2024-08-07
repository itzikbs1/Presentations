const mongoose = require('mongoose');

// Use the credentials of the reviewer user
const uri = 'mongodb+srv://reviewer:!bEDv.#qXK5_WmE@cluster0.mongodb.net/presentation?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
