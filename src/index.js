const express = require('express');
const app = express();
const healthRoutes = require('./routes/health.routes');

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});