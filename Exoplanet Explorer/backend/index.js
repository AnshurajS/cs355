require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes   = require('./routes/auth');
const exoRoutes    = require('./routes/exoplanets');

const app = express();

// API body + CORS
app.use(cors());
app.use(express.json());

// Serve static files from frontend/public
app.use(
  express.static(
    path.join(__dirname, '../frontend/public')
  )
);

// API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/exoplanets', exoRoutes);

// Catch-all to return index.html for any other route
app.get('/{*any}', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../frontend/public/index.html')
  );
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
