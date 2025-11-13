const express = require('express');
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes for authentication
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Routes for health checks
const healthRoutes = require('./routes/health.routes');
app.use('/health', healthRoutes);

// Routes for aluno
const alunoRoutes = require('./routes/aluno.routes');
app.use('/aluno', alunoRoutes);

// Route for matricula
const matriculaRoutes = require('./routes/matricula.routes');
app.use('/matricula', matriculaRoutes);

// Basic route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});