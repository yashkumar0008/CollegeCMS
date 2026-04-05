const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'faculty', 'student'], required: true },
    phone: { type: String },
    address: { type: String },
    photo: { type: String, default: '' },
    photoPublicId: { type: String, default: '' },
    // Student-specific
    enrollmentNo: { type: String },
    department: { type: String },
    semester: { type: Number },
    batch: { type: String },
    // Faculty-specific
    designation: { type: String },
    qualification: { type: String },
    experience: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
