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

// In-memory users array (for demonstration - replace with DB later)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' }
];

// GET all users
app.get('/api/users', (req, res) => {
  res.json({ 
    success: true,
    count: users.length,
    data: users 
  });
});

// GET single user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// POST create new user
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    role: role || 'User'
  };
  
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const { name, email, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  
  res.json({ success: true, data: user });
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const deletedUser = users.splice(index, 1)[0];
  res.json({ success: true, message: 'User deleted', data: deletedUser });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
