const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

// Test data
const repoUrl = 'https://github.com/denniscorsi/envs.git';
const repoName = 'envs';

// Clones repo into the temps folder
const tempsPath = path.join(__dirname, 'server', 'temps');
execSync(`cd ${tempsPath} && git clone ${repoUrl}`);
const repoPath = path.join(tempsPath, repoName);

// An array to hold the paths of all files nested within the repo
const filePaths = [];

// Recursive helper function to get all nested files
const getFiles = (dir) => {
  const dirContents = fs.readdirSync(dir); // This will return an array with names of all files and directories in the top level of the directory

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
  // const regex = /([A-Za-z0-9$_]+)[\s=]+process.env./g;

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

console.log(envs);
// should be [value, awskey, SECRET, MONGOURI, SECRET, VALID]

// Regex parameters:
// [any character that is NOT a letter, number, underscore, or dollar sign]
// [then a string of characters that ARE a letter, number, underscore, or dollar sign]
// [then either a space or an equal sign (any number of these)]
// [then the full string 'process.env.']

// TODO:
// integrate into controller
// include other programming languagls
