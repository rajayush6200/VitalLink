const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { isDatabaseReady, databaseUnavailableResponse } = require('../utils/db');

/* ================= REGISTER ================= */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!isDatabaseReady()) {
    return databaseUnavailableResponse(res);
  }

  try {
    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'   // 👈 DEFAULT ROLE
    });

    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!isDatabaseReady()) {
    return databaseUnavailableResponse(res);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // ✅ IMPORTANT RESPONSE
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role   // 👈 VERY IMPORTANT
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
