const { execSync, exec } = require('child_process');
require('dotenv').config();

const path = require('path');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const githubController = {};

// redirect to github login
githubController.login = (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user%20repo%20repo_deployment%20user:email`);
};

// set github_token and redirect home
githubController.callback = async (req, res, next) => {
  const auth_code = req.query.code;
  await fetch('https://github.com/login/oauth/access_token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + auth_code, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => res.json())
    .then(data => {
      res.cookie('github_token', data.access_token, { httpOnly: true });
      res.redirect('/');
    })
    .catch(err => next(err));
};

// get user data
githubController.userData = async (req, res, next) => {
  if (req.cookies.github_token) {
    const token = req.cookies.github_token;
    await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // console.log('data', data)
        res.locals.data = {
          name: data.name || data.email || data.login,
          email: data.email,
          avatarUrl: data.avatar_url,
          githubId: data.id,
        };
        next();
      })
      .catch(err => console.log(err));
  } else {
    res.status(401).json("Unauthorized");
  }
};

// get user repos
githubController.userRepos = async (req, res, next) => {
  const token = req.cookies.github_token;
  // needs user/repos at the end!
  await fetch('https://api.github.com/user/repos', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      res.locals.data = data;
      next();
    })
    .catch(err => console.log(err));
};

// search public repos
githubController.searchRepos = async (req, res, next) => {
  const search_request = req.get('search');
  await fetch('https://api.github.com/search/repositories?q=' + search_request + '+in:name&sort=stars&order=desc')
    .then(res => res.json())
    .then(data => {
      res.locals.data = data;
      next();
    })
    .catch(err => console.log(err));
};

// clone repos

const docker_username = process.env.DOCKER_USERNAME;
const docker_password = process.env.DOCKER_PASSWORD;

githubController.cloneRepo = (req, res, next) => {

  const url = req.body.url;
  const branch = req.body.branch;
  const splitIt = url.split('/');
  const repoName = splitIt.pop();
  const url_plus_git = url + '.git';

  execSync(
    'docker login -u ' + docker_username + ' -p ' + docker_password + ' && docker build -t deckhandapp/' + repoName + ':5 ' + url_plus_git + '#' + branch + ' && docker push deckhandapp/' + repoName + ':5'
  );

  return next();

};

module.exports = githubController;
