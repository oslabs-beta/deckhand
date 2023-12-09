const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

//need nested files too

const repoUrl = 'https://github.com/denniscorsi/envs.git';
const repoName = 'envs';

// Clones repo into the temps folder
const tempsPath = path.join(__dirname, 'server', 'temps');
execSync(`cd ${tempsPath} git clone ${repoUrl}`);

const repoPath = path.join(tempsPath, repoName);

// will fill an array of all file names nested within the repo
const fileNames = [];
const getFiles = (dir) => {
  fs.readdirSync(repoPath);
};

console.log(fileNames);

// check if directory or file
const isDir = [];
fileNames.forEach((fileName) => {
  const info = fs.statSync(repoPath + '/' + fileName);
  isDir.push(info.isDirectory());
});

console.log(isDir);

const files = [];
const envs = [];

// TODO: clean some of this up with path.join

// fileNames.forEach((fileName) => {
//   files.push(fs.readFileSync(`${path}/${filename}`, 'utf8'));
// });

// files.forEach((file) => {
//   const regex = /([A-Za-z0-9$_]+)[\s=]+process.env./g; // g tag means find all matches
//   let result;
//   while ((result = regex.exec(contents))) {
//     //result will be null if there are no more to be found
//     envs.push(result[1]);
//   }
// });

// console.log(envs);

// [any character that is NOT a letter, number, underscore, or dollar sign]
// [then a string of characters that ARE a letter, number, underscore, or dollar sign]
// [then either a space or an equal sign (any number of these)]
// [then the full string 'process.env.']

// we need the variable *in front* of the process.env

// indices.push(result.index);
