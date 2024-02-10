const express = require('express');
const cookieParser = require('cookie-parser');
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path');
const app = express();
const PORT = 3000;
const { dbInit } = require('./database/dbInit.js');

// Initialize database
const initDatabase = async () => {
  try { await dbInit(); }
  catch (err) { console.log('Failed to initialize database:', err); }
};
initDatabase();

// Require routers
const apiRouter = require(path.join(__dirname, './routes/api.js'));
const githubRouter = require(path.join(__dirname, './routes/github.js'));
const deploymentRouter = require(path.join(__dirname, './routes/deployment.js'));

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// Define route handlers
app.use('/api/github', githubRouter);
app.use('/api/deployment', deploymentRouter);
app.use('/api', apiRouter);

// Handle requests for static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
} else {
  app.get('/', (req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../app/public/index.html'));
  });
}

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
