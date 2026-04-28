require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Models
const User = require('./models/User');
const Charity = require('./models/Charity');
const Draw = require('./models/Draw');
const Score = require('./models/Score');
const Verification = require('./models/Verification');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS (IMPORTANT for deployment)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app' // update later
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));


const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));


if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB error:', err));
} else {
  console.warn('⚠️ MONGODB_URI not set');
}


app.get('/', (req, res) => {
  res.send('🚀 Backend API is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});


function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}

// ================= ADMIN MIDDLEWARE =================

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  }
  next();
}

// ================= SUBSCRIPTION CHECK =================

function requireSubscription(req, res, next) {
  User.findById(req.user.userId)
    .then(user => {
      if (!user || user.subscriptionStatus !== 'active') {
        return res.status(403).json({
          status: 'error',
          message: 'Active subscription required'
        });
      }
      next();
    })
    .catch(err => res.status(500).json({ status: 'error', message: err.message }));
}

// ================= AUTH ROUTES =================

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, username, selectedCharity } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Email exists' });
    }

    const user = new User({
      email,
      password,
      username: username || email.split('@')[0],
      selectedCharity: selectedCharity || '1',
      role: email === 'roopa12@gmail.com' ? 'admin' : 'user'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ status: 'success', token });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ status: 'success', token });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ================= SCORES =================

app.get('/api/scores', authenticateToken, async (req, res) => {
  const scores = await Score.find({ userId: req.user.userId }).sort({ date: -1 });
  res.json(scores);
});

app.post('/api/scores', authenticateToken, requireSubscription, async (req, res) => {
  const { date, score } = req.body;

  const newScore = new Score({ userId: req.user.userId, date, score });
  await newScore.save();

  res.json({ status: 'success' });
});

// ================= FILE UPLOAD =================

app.post('/api/verifications', authenticateToken, async (req, res) => {
  try {
    const { proofImageBase64 } = req.body;

    const base64Data = proofImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const filename = `proof_${Date.now()}.png`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, base64Data, 'base64');

    const verification = new Verification({
      userId: req.user.userId,
      proofImage: `/uploads/${filename}`
    });

    await verification.save();

    res.json({ status: 'success' });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ================= ADMIN =================

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export for serverless (optional)
module.exports = app;