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
    unique: true,
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
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user);
  if(!user) {
    throw new Error('Unable to find user');
  }

  const isMatched = await bcrypt.compare(password, user.password);
  if(!isMatched) {
    throw new Error('Password is incorrect');
  }

  return user;
}

const User = model('User', userSchema);

module.exports = User;