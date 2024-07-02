const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const authUtils = require('../utils/authUtils');

const maxAge = 86400; // 3 days in seconds

// @desc    Get all users
// @route   GET /users
// For testing purposes
// @access  Private
const getAllUsers = async (req, resp) => {
  try {
    const result = await User.find();
    resp.status(200).json(result);
  } catch (err) {
    resp.status(500).json({ message: 'Failed to retrieve users from database' });
  }
};


// @desc    Create a new user
// @route   POST /signup
// @access  Public
const createUser = async (req, resp) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    const token = authUtils.createToken(
      user.username,
      user._id,
    );
    // Always set the headers before sending the response
    resp.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: true, // set to true if your using https
      SameSite: 'Lax',
      domain: '.vercel.app'
    }); // Set the cookie

    resp.status(201).json({
      user: user,
    });

  } catch (err) {
    const errors = authUtils.handleSignUpError(err);
    resp.status(500).json({ errors });
  }
};

// @desc    Create a new user
// @route   PATCH /user
// @access  Private
const updateUser = async (req, resp) => {
  const updates = req.body;
  const token = req.cookies.jwt;
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByIdAndUpdate(decodedToken.user_id, updates, {
      new: true,
      runValidators: true,
    });
    resp.status(200).json(user);
    if (!user) {
      throw new Error('User not found');
    }
  } catch (err) {
    const errors = authUtils.handleSignUpError(err);
    resp.status(500).json({ errors });
  }
};

// @desc    Log in a user
// @route   POST /login
// @access  Public
const loginUser = async (req, resp) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = authUtils.createToken(
          user.username,
          user._id,
        );
        console.log(token);
        resp.cookie('jwt', token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
          secure: true, // set to true if your using https
          SameSite: 'Lax',
          domain: '.vercel.app'
        }); // Set the cookie
        
        resp.status(200).json({
          "user": user,

          //userName = response.data.user.username
        });
      } else {
        throw new Error('Incorrect password!!');
      }
    } else {
      throw new Error('User not found');
    }
  } catch (err) {
    console.log(err);
    const errors = authUtils.handleLogInError(err);
    resp.status(401).json({ errors });
  }
};

// @desc    Log out a user
// @route   GET /logout
// @access  Public
const logoutUser = async (req, resp) => {
  resp.cookie('jwt', '', {
    httpOnly: true,
    maxAge: -1,
    secure: true, // set to true if your using https
    SameSite: 'Lax',
    domain: '.vercel.app'
  }); // negative maxAge so that the cookie expires immediately

  resp.status(200).json({
    message: 'User logged out successfully',
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  loginUser,
  logoutUser,
};
