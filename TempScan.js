const fs = require('fs');
const envs = [];

const contents = fs.readFileSync('./testfile.js', 'utf8');
//console.log(contents);

const regex = /process.env./g; // g tag means find all matches
let result;
const indices = [];
while ((result = regex.exec(contents))) {
  //result will be null if there are no more to be found
  indices.push(result.index);
}

console.log(indices);
