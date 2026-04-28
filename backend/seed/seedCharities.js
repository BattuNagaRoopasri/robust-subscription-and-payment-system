const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const Charity = require('../models/Charity');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/impactgolf';

const charities = [
  {
    name: 'Community Youth Golf Fund',
    category: 'Youth',
    description: 'Support junior training and equipment access.',
    contribution: 10,
    totalRaised: 0,
    status: 'Active',
  },
  {
    name: 'Clean Greens Initiative',
    category: 'Environment',
    description: 'Drive sustainability and green course programs.',
    contribution: 12,
    totalRaised: 0,
    status: 'Active',
  },
  {
    name: 'Women in Golf Network',
    category: 'Community',
    description: 'Mentorship and tournaments for women players.',
    contribution: 15,
    totalRaised: 0,
    status: 'Active',
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB at', MONGO_URI);

    for (const c of charities) {
      const existing = await Charity.findOne({ name: c.name });
      if (existing) {
        await Charity.updateOne({ _id: existing._id }, { $set: c });
        console.log('Updated charity:', c.name);
      } else {
        await Charity.create(c);
        console.log('Created charity:', c.name);
      }
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
