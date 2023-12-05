const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// require routers
const apiRouter = require(path.join(__dirname, './routes/api.js'));
const githubRouter = require(path.join(__dirname, './routes/github.js'));
const deploymentRouter = require(path.join(__dirname, './routes/deployment.js'));

// parse incoming requests
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// handle requests for static files
app.use('/build', express.static(path.join(__dirname, '../app/build')));

// define route handlers
app.use('/api', apiRouter);
app.use('/api/github', githubRouter);
app.use('/api/deployment', deploymentRouter);

// route handler to respond with main app
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../app/public/index.html'));
});

// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  return res.sendStatus(404);
});

// global error handling middleware
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// initialize port listening
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
