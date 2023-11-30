const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

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

// GitHub request for getting user's data
app.get('/getUserData', async (req, res) => {

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

// GitHub OAuth
app.get('/getOauth', (req, res) => {

    res.json('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID + '&scope=repo%20repo_deployment%20user:email')

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
