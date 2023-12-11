const { execSync, exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const DOCKER_USERNAME = process.env.DOCKER_USERNAME;
const DOCKER_PASSWORD = process.env.DOCKER_PASSWORD;

const githubController = {};

// redirect to github login
githubController.login = (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user%20repo%20repo_deployment%20user:email`
  );
};

// set github_token and redirect home
githubController.callback = async (req, res, next) => {
  const auth_code = req.query.code;
  await fetch(
    'https://github.com/login/oauth/access_token?client_id=' +
      CLIENT_ID +
      '&client_secret=' +
      CLIENT_SECRET +
      '&code=' +
      auth_code,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      res.cookie('github_token', data.access_token, { httpOnly: true });
      res.redirect('/');
    })
    .catch((err) => next(err));
};

// get user data
githubController.userData = async (req, res, next) => {
  if (req.cookies.github_token) {
    const token = req.cookies.github_token;
    await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log('data', data)
        res.locals.data = {
          name: data.name || data.email || data.login,
          email: data.email,
          avatarUrl: data.avatar_url,
          githubId: data.id,
        };
        return next();
      })
      .catch((err) => console.log(err));
  } else {
    res.status(401).json('Unauthorized');
  }
};

// get user repos
githubController.userRepos = async (req, res, next) => {
  const token = req.cookies.github_token;
  await fetch('https://api.github.com/user/repos', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data;
      return next();
    })
    .catch((err) => console.log(err));
};

// get public repos
githubController.publicRepos = async (req, res, next) => {
  const token = req.cookies.github_token;
  const { input } = req.body;
  await fetch('https://api.github.com/search/repositories?q=' + input + '+in:name&sort=stars&order=desc', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      res.locals.data = data;
      return next();
    })
    .catch((err) => console.log(err));
};

// get user branches
githubController.branches = async (req, res, next) => {
  const { repo } = req.body;
  const token = req.cookies.github_token;
  await fetch(`https://api.github.com/repos/${repo}/branches`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      res.locals.data = data;
      return next();
    })
    .catch(err => console.log(err));
};

// build repos
githubController.build = (req, res, next) => {
  const { repo, branch } = req.body;
  if (!repo || !branch) console.log('Missing repo and/or branch')

  const cloneUrl = `https://github.com/${repo}.git#${branch}`;
  const imageName = 'deckhandapp/' + repo.split('/').join('-').toLowerCase();

  execSync(`docker login -u ${DOCKER_USERNAME} --password-stdin`, { input: DOCKER_PASSWORD });
  execSync(`docker build -t ${imageName} ${cloneUrl}`);
  execSync(`docker push ${imageName}`);

  res.locals.data = { imageName: imageName, imageTag: 'latest' };
  return next();
};

// Find all env variables in repo
githubController.scanRepo = (req, res, next) => {
  // name of repo will be on request body
  const { repo } = req.body;

  const repoUrl = '...'; //will need to turn name into url

  const envs = [];
  // clone repo
  execSync(`git clone ${repoUrl}`);
  // iterate through files
  const files = [];
  
  // search through each file for process.env
  // add the variable name to the envs array
  // put the array on locals and go to next

  res.locals.envs = envs;
  return next();
};

module.exports = githubController;
