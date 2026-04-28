const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
const issuesRouter = require('./routes/issues');
const workspaceRouter = require('./routes/workspace');
const usersRouter = require('./routes/users');

app.use('/api/issues', issuesRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/users', usersRouter);

// Backward compatibility for /api/models (now in workspace router)
app.get('/api/models', (req, res) => {
  res.redirect(307, '/api/workspace/models');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
