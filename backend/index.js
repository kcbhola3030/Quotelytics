require('dotenv').config();
const express = require('express');
const groupAndMemberManagementRoutes = require('./routes/groupAndMemberManagementRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// // MongoDB connection string
// const mongoURI = process.env.MONGO_URI || 'mongodb+srv://kcbhola123:kc123@cluster0.wj8akhu.mongodb.net/';

// mongoose.connect(mongoURI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use('/api', groupAndMemberManagementRoutes);

app.get('/', (req, res) => {
  res.send('Express server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 