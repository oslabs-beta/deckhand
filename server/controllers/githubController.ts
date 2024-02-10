const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('../database/dbConnect.js');
const cryptoUtils = require('../utils/cryptoUtils.js');

import { Request, Response, NextFunction } from 'express';

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

const githubController: any = {};

// redirect to github login
githubController.login = (req: Request, res: Response) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user%20repo%20repo_deployment%20user:email`
  );
};

// set github_token and redirect home
githubController.callback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    }
  )
    .then((res) => res.json())
    .then((data) => {
      res.cookie('github_token', data.access_token, { httpOnly: true });
      res.redirect('/');
    })
    .catch((err) => next(err));
};

githubController.logout = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.github_token) {
    // Set the cookie's value to empty and expiration date to now
    res.cookie('github_token', '', { expires: new Date(0), httpOnly: true });
  }
  next();
};

githubController.userData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.github_token) {
    const token = req.cookies.github_token;

    // Fetch user data and emails from GitHub
    const userDataFetch = fetch('https://api.github.com/user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const userEmailFetch = fetch('https://api.github.com/user/emails', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([userDataFetch, userEmailFetch])
      .then(async (responses) => {
        if (!responses[0].ok || !responses[1].ok) {
          throw new Error('Network response was not ok');
        }
        const githubData = await responses[0].json();
        const githubEmails = await responses[1].json();

        // Map data from Github
        const email =
          githubEmails.find((email: any) => email.primary)?.email ||
          githubData.email;
        const name = githubData.name || githubData.login || email;
        const avatarUrl = githubData.avatar_url;
        const githubId = githubData.id;

        // Check if the user exists in the database
        const userCheckQuery = 'SELECT * FROM users WHERE email = $1';
        const userExistsResult = await db.query(userCheckQuery, [email]);

        if (userExistsResult.rows.length === 0) {
          // If user does not exist, insert them into the database
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

          const newUser = newUserResult.rows[0];

          res.locals.data = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatarUrl: newUser.avatarurl,
            githubId: newUser.githubid,
            theme: newUser.theme,
            awsAccessKey: newUser.awsaccesskey,
            awsSecretKey: newUser.awssecretkey,
            state: newUser.state,
          };
        } else {
          // User exists, return the database values
          const user = userExistsResult.rows[0];

          res.locals.data = {
            id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarurl,
            githubId: user.githubid,
            theme: user.theme,
            awsAccessKey: cryptoUtils.decrypt(user.awsaccesskey),
            awsSecretKey: cryptoUtils.decrypt(user.awssecretkey),
            state: user.state && JSON.parse(user.state), // Parse JSONB state if it exists
          };
        }

        return next();
      })
      .catch((error) => next(error));
  } else {
    res.status(401).json('Unauthorized');
  }
};

// get user repos
githubController.userRepos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

// get public repos
githubController.publicRepos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    .catch((err) => next(err));
};

// get user branches
githubController.branches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      res.locals.data = data.map((el: any) => el.name);
      return next();
    })
    .catch((err) => next(err));
};

// (not currently used) dockerize and push repo to Docker Hub
githubController.build = (req: Request, res: Response, next: NextFunction) => {
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
githubController.scanRepo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { repo, branch } = req.body;
  const repoName = repo.split('/')[1];

  // const cloneUrl = `https://github.com/${repo}.git#${branch}`;
  //➜  Desktop git clone -b testbranch https://github.com/denniscorsi/envs.git

  const cloneUrl = `https://github.com/${repo}.git`;

  // Clones repo into the temps folder
  let tempsPath;
  try {
    tempsPath = path.join(__dirname, '..', 'temps');
    execSync(`cd ${tempsPath} && git clone -b ${branch} ${cloneUrl}`);
  } catch {
    console.log(`Could not clone ${repo} ${branch}`);
    res.locals.envs = undefined;
    return next();
  }

  const repoPath = path.join(tempsPath, repoName);

  // An array to hold the paths of all files nested within the repo
  const filePaths: any = [];

  // Recursive helper function to get all nested files
  const getFiles = (dir: any) => {
    const dirContents = fs.readdirSync(dir); // This will return an array with names of all files and directories in the *top* level of the directory

    // Ignoring anything within the .git directory, check if each content if a file or directory
    // If it's a file, push its path to filePaths
    // If it's a directory, send it recursively back into this function
    dirContents.forEach((content: any) => {
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

  const fileContents: any = [];
  const envs = new Set();

  // Push the text content of each file into the fileContents array
  // @ts-expect-error TS(7006) FIXME: Parameter 'filePath' implicitly has an 'any' type.
  filePaths.forEach((filePath) => {
    fileContents.push(fs.readFileSync(filePath, 'utf8'));
  });

  // Using regex, scan the text of each file for environmental variables and push them to envs array.
  // @ts-expect-error TS(7006) FIXME: Parameter 'fileString' implicitly has an 'any' typ... Remove this comment to see the full error message
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
  execSync(`cd ${tempsPath} && rm -r ${repoName}`);

  // Convert set into an array
  const envArr = Array.from(envs);

  console.log('Scanned for env variables and found:', envArr);

  res.locals.envs = envArr;
  return next();
};

// Finds the exposed port in the dockerfile
githubController.findExposedPort = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { repo, branch } = req.body;
  const repoName = repo.split('/')[1];

  const cloneUrl = `https://github.com/${repo}.git`;

  // Clones repo into the temps folder
  const tempsPath = path.join(__dirname, '..', 'temps');
  execSync(`cd ${tempsPath} && git clone -b ${branch} ${cloneUrl}`);
  const repoPath = path.join(tempsPath, repoName);

  let exposedPort;
  try {
    const dockerfile = fs.readFileSync(`${repoPath}/dockerfile`);
    const regex = /expose\s+(\d+)/i;
    // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
    exposedPort = Number(regex.exec(dockerfile)[1]);
  } catch {
    console.log('failed to find dockerfile');
    exposedPort = undefined;
  }

  // Delete cloned repo
  execSync(`cd ${tempsPath} && rm -r ${repoName}`);

  console.log('Scanned for exposed port and found:', exposedPort);

  res.locals.data = { exposedPort };
  return next();
};

module.exports = githubController;
