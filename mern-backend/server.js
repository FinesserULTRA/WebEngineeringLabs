const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mernlab')
.then(async () => {
  console.log('MongoDB connected');
  
  // Seed initial users if database is empty
  const count = await User.countDocuments();
  if (count === 0) {
    await User.insertMany([
      { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      { name: 'Bob Johnson', email: 'bob@example.com', role: 'User' }
    ]);
    console.log('Seeded initial users');
  }
})
.catch(err => console.log(err));

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ 
      success: true,
      count: users.length,
      data: users 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    
    const newUser = await User.create({ name, email, role });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
