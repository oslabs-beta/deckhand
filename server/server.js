const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

// handle requests for static files
app.use('/build', express.static(path.join(__dirname, '../app/build')));
app.use(cors());

// Allows the env variables to load
require('dotenv').config();

// define route handlers
app.use('/api', apiRouter);
app.use('/api/github', githubRouter);
app.use('/api/deployment', deploymentRouter);

// route handler to respond with main app
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../app/public/index.html'));
});

// the env information for GitHub
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// GitHub request for token
app.get('/getAccessToken', async (req, res) => {

    const params = '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + req.query.code;

    await fetch('https://github.com/login/oauth/access_token' + params, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => response.json())
    .then(data => res.json(data))
    .catch(err => {
        console.log(err)
    });


});

// GitHub request for getting user's repos.
app.get('/getUserData', async (req, res) => {

    req.get('Authorization');
    await fetch('https://api.github.com/user/repos', {
        method: 'GET',
        headers: {
            'Authorization': req.get('Authorization'),
            'scope': req.get('scope')
    }
    }).then(response => 
      response.json())
    .then(data =>
        res.status(200).json(data)
)
    .catch(err => console.log(err));

});

// this is a redirect that sets our token as a cookie needs for authentication.
app.get('/github', (req, res) => {

    const code_token = req.query.code;

    res.cookie('code_token', code_token);
    res.redirect('/');

});

// this is where we grab the token to do our authentication to get user's data and repos.
app.get('/grabCookie', (req, res) => {

    const our_cookie = req.cookies.code_token;
    res.json(our_cookie);

})

// this is where we get the user's personal data.
app.get('/getUserInfo', async (req, res) => {

    req.get('Authorization');
    await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Authorization': req.get('Authorization')
    }
    }).then(response => 
      response.json())
    .then(data =>
      res.status(200).json(data))
    .catch(err => console.log(err));

});

// this is where a user can search for any public repos on GitHub
app.get('/searchInfo', async (req, res) => {

    console.log('in search info');

    const search_request = req.get('search');

    await fetch('https://api.github.com/search/repositories?q=' + search_request + '+in:name+language:javascript&sort=stars&order=desc')
    .then(response => 
    response.json())
    .then(data =>
    res.status(200).json(data))
    .catch(err => console.log(err));

});

// GitHub OAuth where we send a request to GitHub
app.get('/getOauth', (req, res) => {

    res.status(200).json('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID + '&scope=user%20repo%20repo_deployment%20user:email')

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
