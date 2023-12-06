const { execSync } = require('child_process');
require('dotenv').config();

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
  await fetch('https://api.github.com/repos', {
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
  await fetch('https://api.github.com/search/repositories?q=' + search_request + '+in:name+language:javascript&sort=stars&order=desc')
    .then(res => res.json())
    .then(data => {
      res.locals.data = data;
      next();
    })
    .catch(err => console.log(err));
};

// clone repos
githubController.cloneRepo = async (req, res, next) => {
  const url = req.body.url;
  execSync('git clone' + url, {
    cwd: path.resolve(__dirname, './testing')
  })
};

module.exports = githubController;
