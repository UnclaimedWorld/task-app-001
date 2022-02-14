const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value < 0) {
        throw new Error('Age must be a positive');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if(!validator.isLength(value, { min: 6 })) {
        throw new Error('Password must be at least 6 characters length');
      } else if(validator.contains(value.toLowerCase(), 'password')) {
        throw new Error('Password word can\'t contain "password"');
      }
    }
  }
});
userSchema.pre('save', async function(next) {
  const user = this;
  console.log('save');
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = model('User', userSchema);

module.exports = User;