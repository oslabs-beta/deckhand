const { execSync, exec } = require('child_process');
const fs = require('fs');
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

githubController.logout = (req, res, next) => {
  if (req.cookies.github_token) {
    // Set the cookie's value to empty and expiration date to now
    res.cookie('github_token', '', { expires: new Date(0), httpOnly: true });
  }
  next();
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
  await fetch(
    'https://api.github.com/search/repositories?q=' +
    input +
    '+in:name&sort=stars&order=desc',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
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
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.map((el) => el.name)
      return next();
    })
    .catch((err) => console.log(err));
};

// build repos
githubController.build = (req, res, next) => {
  const { repo, branch } = req.body;
  if (!repo || !branch) console.log('Missing repo and/or branch');

  const cloneUrl = `https://github.com/${repo}.git#${branch}`;
  const imageName = 'deckhandapp/' + repo.split('/').join('-').toLowerCase();

  execSync(`docker login -u ${DOCKER_USERNAME} --password-stdin`, {
    input: DOCKER_PASSWORD,
  });
  execSync(`docker build -t ${imageName} ${cloneUrl}`);
  execSync(`docker push ${imageName}`);

  res.locals.data = { imageName: imageName, imageTag: 'latest' };
  return next();
};

// Find all env variables in repo
githubController.scanRepo = (req, res, next) => {
  const { repo, branch } = req.body;
  const repoName = repo.split('/')[1];

  // const cloneUrl = `https://github.com/${repo}.git#${branch}`;
  //➜  Desktop git clone -b testbranch https://github.com/denniscorsi/envs.git

  const cloneUrl = `https://github.com/${repo}.git`;

  // Clones repo into the temps folder
  const tempsPath = path.join(__dirname, '..', 'temps');
  execSync(`cd ${tempsPath} && git clone -b ${branch} ${cloneUrl}`);
  const repoPath = path.join(tempsPath, repoName);

  // An array to hold the paths of all files nested within the repo
  const filePaths = [];

  // Recursive helper function to get all nested files
  const getFiles = (dir) => {
    const dirContents = fs.readdirSync(dir); // This will return an array with names of all files and directories in the *top* level of the directory

    // Ignoring anything within the .git directory, check if each content if a file or directory
    // If it's a file, push its path to filePaths
    // If it's a directory, send it recursively back into this function
    dirContents.forEach((content) => {
      if (content !== '.git') {
        const contentPath = path.join(dir, content);
        const stats = fs.statSync(contentPath);
        if (stats.isDirectory()) getFiles(contentPath);
        else filePaths.push(contentPath);
      }
    });
  };

  // Execute function on the cloned repo
  getFiles(repoPath);

  const fileContents = [];
  const envs = new Set();

  // Push the text content of each file into the fileContents array
  filePaths.forEach((filePath) => {
    fileContents.push(fs.readFileSync(filePath, 'utf8'));
  });

  // Using regex, scan the text of each file for environmental variables and push them to envs array.
  fileContents.forEach((fileString) => {
    const regexJs = /process.env.([\w$]+)/g;
    const regexPy = /os.environ.get\(['"](\w+)/g;
    const regexPy2 = /os.getenv\(['"](\w+)/g;
    const regexRuby = /ENV\[['"](\w+)/g;
    const regexJava = /System.getenv\(['"]([\w$]+)/g;
    const regexPHP1 = /\$_ENV\[['"]([\w$]+)/g;
    const regexPHP2 = /getenv\(['"]([\w$]+)/g;
    const regexCSharp = /Environment.GetEnvironmentVariable\(['"](\w+)/g;

    regexes = [
      regexJs,
      regexPy,
      regexPy2,
      regexRuby,
      regexJava,
      regexPHP1,
      regexPHP2,
      regexCSharp,
    ];

    regexes.forEach((regex) => {
      let result = regex.exec(fileString);

      while (result) {
        envs.add(result[1]);
        result = regex.exec(fileString);
      }
    });
  });

  // Delete cloned repo
  execSync(`cd ${tempsPath} && rm -r ${repoName}`);

  // Convert set into an array
  const envArr = Array.from(envs);

  console.log('Scanned for env variables and found:', envArr);

  res.locals.envs = envArr;
  return next();
};

module.exports = githubController;
