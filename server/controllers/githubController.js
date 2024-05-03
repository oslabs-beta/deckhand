const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('../database/dbConnect');
const cryptoUtils = require('../utils/cryptoUtils');

const GITHUB_CLIENT_ID =
  process.env.NODE_ENV === 'production'
    ? process.env.GITHUB_CLIENT_ID_PROD
    : process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET =
  process.env.NODE_ENV === 'production'
    ? process.env.GITHUB_CLIENT_SECRET_PROD
    : process.env.GITHUB_CLIENT_SECRET;
const DOCKER_USERNAME = process.env.DOCKER_USERNAME;
const DOCKER_PASSWORD = process.env.DOCKER_PASSWORD;

const githubController = {};

// Redirect to GitHub login
githubController.login = (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user%20repo%20repo_deployment%20user:email`,
  );
};

// Set github_token and redirect home
githubController.callback = async (req, res, next) => {
  const auth_code = req.query.code;
  await fetch(
    'https://github.com/login/oauth/access_token?client_id=' +
    GITHUB_CLIENT_ID +
    '&client_secret=' +
    GITHUB_CLIENT_SECRET +
    '&code=' +
    auth_code,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    },
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

githubController.userData = async (req, res, next) => {
  const token = req.cookies.github_token;
  if (!token || token === 'undefined') {
    return res.status(401).json('Unauthorized');
  }

  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    // Fetch associated data from GitHub
    console.log('Fetching data associated with token');
    const [userResponse, emailsResponse] = await Promise.all([
      fetch('https://api.github.com/user', options),
      fetch('https://api.github.com/user/emails', options)
    ]);

    if (!userResponse.ok || !emailsResponse.ok) {
      throw new Error('Failed to fetch data from GitHub');
    }

    const userData = await userResponse.json();
    const emailsData = await emailsResponse.json();

    const email = emailsData.find(email => email.primary)?.email || userData.email;
    const name = userData.name || userData.login || email;
    const avatarUrl = userData.avatar_url;
    const githubId = userData.id;

    // Fetch user data from database
    console.log('Fetching user data')
    const userCheckQuery = 'SELECT * FROM users WHERE email = $1';
    const userExistsResult = await db.query(userCheckQuery, [email]);

    let user;
    // If user does not exist, create it
    if (userExistsResult.rows.length === 0) {
      // Create new user
      console.log('Creating new user');
      const createUserQuery = `
          INSERT INTO users (name, email, avatarurl, githubid)
          VALUES ($1, $2, $3, $4)
          RETURNING _id, name, email, avatarurl, githubid, theme, awsaccesskey, awssecretkey, state
        `;
      const newUserResult = await db.query(createUserQuery, [
        name,
        email,
        avatarUrl,
        githubId,
      ]);
      user = newUserResult.rows[0];
    } else {
      user = userExistsResult.rows[0];
    }

    // Map data from the database
    res.locals.data = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarurl,
      githubId: user.githubid,
      theme: user.theme,
      awsAccessKey: user.awsaccesskey ? cryptoUtils.decrypt(user.awsaccesskey) : null,
      awsSecretKey: user.awssecretkey ? cryptoUtils.decrypt(user.awssecretkey) : null,
      state: user.state ? JSON.parse(user.state) : null,
    };

    next();
  } catch (error) {
    console.error('Error processing request:', error);
    next(error);
  }
};

// Get user repos
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
    .catch((err) => next(err));
};

// Get public repos
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
    },
  )
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data;
      return next();
    })
    .catch((err) => next(err));
};

// Get user branches
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
      res.locals.data = data.map((el) => el.name);
      return next();
    })
    .catch((err) => next(err));
};

// (not currently used) Dockerize and push repo to Docker Hub
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
  let tempsPath;
  try {
    tempsPath = path.join(__dirname, '..', 'temps');
    execSync(`cd "${tempsPath}" && git clone -b ${branch} ${cloneUrl}`);
  } catch {
    console.log(`Could not clone ${repo} ${branch}`);
    res.locals.envs = undefined;
    return next();
  }

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

    const regexes = [
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
  execSync(`cd "${tempsPath}" && rm -r ${repoName}`);

  // Convert set into an array
  const envArr = Array.from(envs);

  console.log('Scanned for env variables and found:', envArr);

  res.locals.envs = envArr;
  return next();
};

// Finds the exposed port in the GitHub repo
githubController.findExposedPort = (req, res, next) => {
  const { repo, branch } = req.body;
  const repoName = repo.split('/')[1];
  const cloneUrl = `https://github.com/${repo}.git`;
  let exposedPort;

  try {
    // Clone repo into temp folder
    console.log('Cloning repo');
    const tempPath = path.join(__dirname, '..', 'temps');
    execSync(`cd ${tempPath} && git clone -b ${branch} ${cloneUrl}`);
    const repoPath = path.join(tempPath, repoName);

    // Scan repo for exposed port
    console.log('Scanning for exposed port');
    try {
      const dockerfile = fs.readFileSync(`${repoPath}/dockerfile`);
      const regex = /expose\s+(\d+)/i;
      exposedPort = Number(regex.exec(dockerfile)[1]);
      console.log('Exposed port:', exposedPort);
    } catch {
      console.log('Failed to find dockerfile');
      exposedPort = undefined;
    }

    // Delete cloned repo
    execSync(`cd ${tempPath} && rm -r ${repoName}`);

    res.locals.data = { exposedPort };
    return next();
  } catch (err) {
    return next({
      log: `Error in findExposedPort: ${err}`,
      message: { err: 'An error occurred trying to find an exposed port' },
    });
  }
};

module.exports = githubController;
