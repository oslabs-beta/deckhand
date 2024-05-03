const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const PORT = 3000;
const { dbInit } = require('./database/dbInit');

// Import routers
const apiRouter = require(path.join(__dirname, './routes/api'));
const githubRouter = require(path.join(__dirname, './routes/github'));
const deploymentRouter = require(path.join(__dirname, './routes/deployment'));

// Define variables
const prod: boolean = process.env.NODE_ENV === 'production';

// Initialize database
const initDatabase = async () => {
  try { await dbInit(); }
  catch (err) { console.log('Failed to initialize database:', err); }
};
initDatabase();

// Set middleware
app.use((req: any, res: any, next: any) => {
  console.log(req.method, req.path);
  next();
});
app.use((req: any, res: any, next: any) => {
    res.on('finish', () => console.log('Response:', res.statusCode));
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, prod ? '../build' : '../app/public')))

// Define route handlers
app.use('/api/github', githubRouter);
app.use('/api/deployment', deploymentRouter);
app.use('/api', apiRouter);

// SPA fallback
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, prod ? '../build/index.html' : '../app/public/index.html'));
});

// Catch-all route handler for any requests to an unknown route
app.use('*', (req: any, res: any) => {
  return res.sendStatus(404);
});

// Global error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Initialize port listening
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
