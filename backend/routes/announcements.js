const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 👁️ GET ALL ANNOUNCEMENTS (Public - for login page + admin)
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Fetching announcements...');
    
    const announcements = await mongoose.connection.db
      .collection('announcements')
      .find({})
      .sort({ createdAt: -1 }) // Newest first
      .toArray();
    
    console.log(`✅ Found ${announcements.length} announcements`);
    res.json(announcements);
  } catch (error) {
    console.error('💥 Error loading announcements:', error);
    res.status(500).json({ message: 'Error loading announcements' });
  }
});

// 📢 ADD NEW ANNOUNCEMENT (Admin)
router.post('/', async (req, res) => {
  try {
    const { title, message, bloodGroup, date, priority } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message required' });
    }

    const announcement = {
      title: title.trim(),
      message: message.trim(),
      bloodGroup: bloodGroup && bloodGroup.trim() ? bloodGroup.trim() : null,
      date: date || null,
      priority: priority || 'normal',
      createdAt: new Date()
    };
    
    const result = await mongoose.connection.db
      .collection('announcements')
      .insertOne(announcement);
    
    console.log('✅ New announcement created:', announcement.title);
    res.json({ 
      message: 'Announcement posted successfully',
      id: result.insertedId 
    });
  } catch (error) {
    console.error('💥 Error creating announcement:', error);
    res.status(500).json({ message: 'Error posting announcement' });
  }
});

// 🗑️ DELETE ANNOUNCEMENT (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection('announcements')
      .deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    
    if (result.deletedCount > 0) {
      console.log('✅ Announcement deleted:', req.params.id);
      res.json({ message: 'Announcement deleted successfully' });
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    console.error('💥 Error deleting announcement:', error);
    res.status(500).json({ message: 'Error deleting announcement' });
  }
});

module.exports = router;
