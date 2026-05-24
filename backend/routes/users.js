const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 👥 GET ALL USERS
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Loading users...');
    
    // Direct access to 'users' collection (confirmed name)
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      console.log('📭 No users found');
      return res.json([]);
    }
    
    // Format for frontend
    const safeUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name || user.username || user.email?.split('@')[0] || 'N/A',
      email: user.email || 'N/A',
      phone: user.phone || 'N/A',
      role: user.role || 'user'
    })).filter(user => user.email !== 'N/A'); // Only users with email
    
    console.log(`✅ Sending ${safeUsers.length} users`);
    res.json(safeUsers);
    
  } catch (error) {
    console.error('💥 Users error:', error);
    res.status(500).json({ message: 'Error loading users' });
  }
});

// 🗑️ DELETE USER
router.delete('/:id', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('users').deleteOne({
      _id: new mongoose.Types.ObjectId(req.params.id)
    });
    
    if (result.deletedCount > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
