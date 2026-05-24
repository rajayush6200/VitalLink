const mongoose = require('mongoose');

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

function databaseUnavailableResponse(res) {
  return res.status(503).json({
    error: 'Database unavailable. The server cannot reach MongoDB.',
    hint: 'On Render, set MONGO_URI to your MongoDB Atlas connection string and allow 0.0.0.0/0 in Atlas Network Access.',
  });
}

module.exports = { isDatabaseReady, databaseUnavailableResponse };
