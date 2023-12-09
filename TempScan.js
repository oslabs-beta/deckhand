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
const envs = [];

// Push the text content of each file into the fileContents array
filePaths.forEach((filePath) => {
  fileContents.push(fs.readFileSync(filePath, 'utf8'));
});

// Using regex, scan the text of each file for environmental variables and push them to envs array.
fileContents.forEach((fileString) => {
  const regex = /([A-Za-z0-9$_]+)[\s=]+process.env./g;
  // let result = regex.exec(fileString);

  // fix this to concat each result to the final array 
  let envs2 = fileString.match(regex);
  console.log('ENVS:', envs2);
  // while (result) {
  //   console.log(result);
  //   envs.push(result[1]);
  //   result = regex.exec(fileString);
  // }
});

// should be [key, $val_2, validation, secret_messsage, uri]

// Regex parameters:
// [any character that is NOT a letter, number, underscore, or dollar sign]
// [then a string of characters that ARE a letter, number, underscore, or dollar sign]
// [then either a space or an equal sign (any number of these)]
// [then the full string 'process.env.']

// delelte folder once done
// look into which part of variable need in configmap
