require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Charity = require('./models/Charity');
const Draw = require('./models/Draw');

const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Serve uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.warn('WARNING: MONGODB_URI is not set in .env file!');
}

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Root route for Vercel
app.get('/', (req, res) => {
  res.send('ImpactGolf Backend API is running!');
});

const Score = require('./models/Score');

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ status: 'error', message: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Get all scores for user
app.get('/api/scores', authenticateToken, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Subscription Middleware
function requireSubscription(req, res, next) {
  User.findById(req.user.userId).then(user => {
    if (!user || user.subscriptionStatus !== 'active') {
      return res.status(403).json({ status: 'error', message: 'An active subscription is required to perform this action.' });
    }
    next();
  }).catch(err => {
    res.status(500).json({ status: 'error', message: err.message });
  });
}

// Add a new score (Max 5, rolling logic) - Requires Active Subscription
app.post('/api/scores', authenticateToken, requireSubscription, async (req, res) => {
  const { date, score } = req.body;
  try {
    // Check if score for this date already exists
    const existing = await Score.findOne({ userId: req.user.userId, date });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'A score for this date already exists.' });
    }

    const newScore = new Score({ userId: req.user.userId, date, score });
    await newScore.save();

    // Implement rolling 5 logic
    const scores = await Score.find({ userId: req.user.userId }).sort({ date: -1 });
    if (scores.length > 5) {
      // Delete the oldest scores beyond 5
      const toDelete = scores.slice(5);
      for (const oldScore of toDelete) {
        await Score.findByIdAndDelete(oldScore._id);
      }
    }

    res.json({ status: 'success', message: 'Score added' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Edit a score
app.put('/api/scores/:id', authenticateToken, async (req, res) => {
  const { date, score } = req.body;
  try {
    const existing = await Score.findOne({ userId: req.user.userId, date, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'A score for this date already exists.' });
    }

    await Score.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, score },
      { new: true, runValidators: true }
    );
    res.json({ status: 'success', message: 'Score updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Delete a score
app.delete('/api/scores/:id', authenticateToken, async (req, res) => {
  try {
    await Score.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ status: 'success', message: 'Score deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const Verification = require('./models/Verification');

// User Upload Proof Route
app.post('/api/verifications', authenticateToken, async (req, res) => {
  const { drawMonth, proofImageBase64 } = req.body;
  
  if (!drawMonth || !proofImageBase64) {
    return res.status(400).json({ status: 'error', message: 'Missing fields' });
  }

  try {
    // Process base64 string
    const base64Data = proofImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const extension = proofImageBase64.split(';')[0].split('/')[1] || 'png';
    const filename = `proof_${req.user.userId}_${Date.now()}.${extension}`;
    const filepath = path.join(uploadsDir, filename);
    
    // Save to disk
    fs.writeFileSync(filepath, base64Data, { encoding: 'base64' });

    // Save to DB
    const verification = new Verification({
      userId: req.user.userId,
      drawMonth,
      proofImage: `/uploads/${filename}`
    });
    await verification.save();

    res.json({ status: 'success', message: 'Proof uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to upload proof' });
  }
});

// Get User's Verifications
app.get('/api/verifications/me', authenticateToken, async (req, res) => {
  try {
    const verifications = await Verification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: verifications });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Admin Middleware Check
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  }
  next();
}

// Get All Verifications (Admin)
app.get('/api/admin/verifications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const verifications = await Verification.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json({ status: 'success', data: verifications });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update Verification Status (Admin)
app.put('/api/admin/verifications/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['Pending Review', 'Approved', 'Rejected', 'Paid'].includes(status)) {
    return res.status(400).json({ status: 'error', message: 'Invalid status' });
  }

  try {
    const verification = await Verification.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!verification) return res.status(404).json({ status: 'error', message: 'Not found' });
    
    res.json({ status: 'success', data: verification });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Admin: Stats ---
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubs = await User.countDocuments({ subscriptionStatus: 'active' });
    
    // Assume $10/month, 50% prize, 30% charity
    const totalRevenue = activeSubs * 10;
    const prizePool = totalRevenue * 0.50;
    const charityPool = totalRevenue * 0.30;
    
    res.json({
      status: 'success',
      data: {
        totalUsers,
        activeSubscriptions: activeSubs,
        totalPrizePool: prizePool,
        charityContributions: charityPool
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Admin: Users ---
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, subscriptionStatus } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;
    
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Admin: Charities ---
app.get('/api/admin/charities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json({ status: 'success', data: charities });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/admin/charities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const charity = new Charity(req.body);
    await charity.save();
    res.json({ status: 'success', data: charity });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.put('/api/admin/charities/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', data: charity });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/admin/charities/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Charity.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Charity deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Public charities endpoint for users
app.get('/api/charities', async (req, res) => {
  try {
    const charities = await Charity.find({ status: 'Active' });
    res.json({ status: 'success', data: charities });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Admin: Draws ---
app.get('/api/admin/draws', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const draws = await Draw.find().populate('winners.user', 'username email').sort({ createdAt: -1 });
    res.json({ status: 'success', data: draws });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/admin/draws/simulate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Simple mock logic for simulation: pick up to 2 random active users
    const users = await User.find({ subscriptionStatus: 'active' });
    if (users.length === 0) {
      return res.json({ status: 'success', data: [] });
    }
    
    // Pick randomly
    const shuffled = users.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(2, users.length));
    
    const winners = selected.map(u => ({
      user: { _id: u._id, username: u.username, email: u.email },
      prizeAmount: 500, // mock amount
      matchType: '4-Number Match'
    }));
    
    res.json({ status: 'success', data: winners });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/admin/draws/publish', authenticateToken, requireAdmin, async (req, res) => {
  const { month, winners } = req.body;
  try {
    // Note: in a real system we'd map the winner user IDs properly
    const dbWinners = winners.map(w => ({
      user: w.user._id,
      prizeAmount: w.prizeAmount,
      matchType: w.matchType
    }));
    
    const draw = new Draw({
      month,
      winners: dbWinners,
      status: 'Published'
    });
    await draw.save();
    
    res.json({ status: 'success', data: draw });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username, selectedCharity } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }
    
    const user = new User({ 
      email, 
      password, 
      username: username || email.split('@')[0],
      selectedCharity: selectedCharity || '1',
      role: email === 'roopa12@gmail.com' ? 'admin' : 'user'
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ status: 'success', token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Auto-upgrade test user to admin for development
    if (email === 'roopa12@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }
    
    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ status: 'success', token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Subscription Endpoints ---

// Get current subscription status
app.get('/api/subscription', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    
    // Check if subscription has expired
    if (user.subscriptionStatus === 'active' && user.subscriptionExpiresAt && new Date() > user.subscriptionExpiresAt) {
      user.subscriptionStatus = 'past_due';
      await user.save();
    }

    res.json({ 
      status: 'success', 
      data: {
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        expiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Mock Checkout Session creation
app.post('/api/subscription/checkout', authenticateToken, async (req, res) => {
  const { plan } = req.body; // 'monthly' or 'yearly'
  if (!['monthly', 'yearly'].includes(plan)) {
    return res.status(400).json({ status: 'error', message: 'Invalid plan selected' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    // Mock successful payment and subscription activation
    user.subscriptionPlan = plan;
    user.subscriptionStatus = 'active';
    
    // Set expiration date (1 month or 1 year from now)
    const expiresAt = new Date();
    if (plan === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    user.subscriptionExpiresAt = expiresAt;
    
    await user.save();

    res.json({ 
      status: 'success', 
      message: 'Subscription activated successfully!',
      data: {
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        expiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Cancel Subscription
app.post('/api/subscription/cancel', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    user.subscriptionStatus = 'canceled';
    // We keep the expiration date so they have access until the end of the period
    
    await user.save();

    res.json({ 
      status: 'success', 
      message: 'Subscription canceled successfully. You will have access until the end of your billing period.',
      data: {
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        expiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel serverless deployment
module.exports = app;
