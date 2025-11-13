const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mernlab')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Users API Route
app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users', users: [] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
