require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const groupAndMemberManagementRoutes = require('./routes/groupAndMemberManagementRoutes');
const ichraRoutes = require('./routes/ichraRoutes');
const dataIngestionRoutes = require('./routes/DataIngest/dataIngestionRoutes');
// const premiumCalculationRoutes = require('./routes/premiumCalculation/premiumRoutes');
const offMarketRoutes = require('./routes/premiumCalculation/offMarket');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://kcbhola123:kc123@cluster0.wj8akhu.mongodb.net/';

mongoose.connect(mongoURI) 
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // if you're using cookies or sessions
}));  
app.use(express.json());

app.use('/api', groupAndMemberManagementRoutes);
app.use('/api/ichra', ichraRoutes);
app.use('/api/data', dataIngestionRoutes);
// app.use('/api/premium', premiumCalculationRoutes);
app.use('/api/offMarket', offMarketRoutes);

app.get('/', (req, res) => {
  res.send('Express server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
}); 