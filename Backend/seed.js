require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email: 'admin@college.edu' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@college.edu',
    password: 'Admin@123',
    role: 'admin',
    phone: '9999999999',
    department: 'Administration',
  });
  console.log('Admin created:', admin.email, '| Password: Admin@123');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
