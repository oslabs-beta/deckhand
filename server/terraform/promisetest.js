const util = require('util');
const { exec } = require('child_process');

const func = async () => {
  const execProm = util.promisify(exec);
  const promise = await execProm('echo hello');
  const result = promise.stdout;
  return result;
};

const res = func();

res.then((data) => console.log('resolved:', data));






// const result = exec('echo hello');
// result.stdout.on('data', (data) => {
//   console.log(data);
//   console.log('***');
// });

// result.on('close', (data) => {
//   console.log(data);
//   console.log('***');
// });
