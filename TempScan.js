const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

//need nested files too

const repoUrl = 'https://github.com/denniscorsi/envs.git';
const repoName = 'envs';

// Clones repo into the temps folder
const tempsPath = path.join(__dirname, 'server', 'temps');
console.log(tempsPath);
execSync(`cd ${tempsPath} && git clone ${repoUrl}`);

const repoPath = path.join(tempsPath, repoName);

// will fill an array of all file names nested within the repo
const filePaths = [];
const getFiles = (dir) => {
  console.log('----');
  console.log('DIR:', dir);
  const contents = fs.readdirSync(dir); // This will return an array with names of all files and directories, not differentiated
  console.log('CONTENTS:', contents);
  contents.forEach((content) => {
    if (content !== '.git') {
      // find better name for content
      const contentPath = path.join(dir, content);
      const stats = fs.statSync(contentPath);
      if (stats.isDirectory()) {
        getFiles(contentPath);
      } else filePaths.push(contentPath);
    }
  });
};

getFiles(repoPath);

console.log('FILEPATHS:', filePaths);

const files = [];
const envs = [];

filePaths.forEach((filePath) => {
  files.push(fs.readFileSync(filePath, 'utf8'));
});

console.log('FILES:', files);

files.forEach((file) => {
  const regex = /([A-Za-z0-9$_]+)[\s=]+process.env./g; // g tag means find all matches
  let result;
  while ((result = regex.exec(file))) {
    //result will be null if there are no more to be found
    envs.push(result[1]);
  }
});

console.log('ENVS:', envs); // should be [key, $val_2, validation, secret_messsage, uri]

// [any character that is NOT a letter, number, underscore, or dollar sign]
// [then a string of characters that ARE a letter, number, underscore, or dollar sign]
// [then either a space or an equal sign (any number of these)]
// [then the full string 'process.env.']

// we need the variable *in front* of the process.env

// indices.push(result.index);
