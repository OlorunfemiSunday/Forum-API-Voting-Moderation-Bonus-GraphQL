require('dotenv').config();
const express = require('express');
require('express-async-errors'); // allows throwing async errors without try/catch
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./src/routes/auth');
const threadRoutes = require('./src/routes/threads');
const commentRoutes = require('./src/routes/comments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Forum API is running ✅');
});

// Error handler (last middleware)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  });
