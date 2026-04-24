const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Mock scores route
app.get('/api/scores', (req, res) => {
  res.json([
    { id: '1', date: '2023-10-15', score: 36 },
    { id: '2', date: '2023-10-12', score: 32 },
    { id: '3', date: '2023-10-05', score: 41 },
  ]);
});

// Mock charity update route
app.post('/api/charity', (req, res) => {
  const { charityId, percentage } = req.body;
  // In a real app, update Supabase here
  res.json({ status: 'success', message: 'Charity updated' });
});

// Login mock route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ status: 'success', token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
