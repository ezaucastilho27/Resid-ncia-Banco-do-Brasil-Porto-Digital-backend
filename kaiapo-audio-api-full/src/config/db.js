const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaiapo_audio_db';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB conectado');
  return mongoose;
};
