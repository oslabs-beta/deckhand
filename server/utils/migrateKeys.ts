const cryptoUtils = require('./cryptoUtils.js');

const migrationQuery = (id, awsaccesskey, awssecretkey) => {
  console.log(`UPDATE users \nSET awsaccesskey = '${cryptoUtils.encrypt(awsaccesskey)}', \nawssecretkey = '${cryptoUtils.encrypt(awssecretkey)}' \nWHERE _id = '${id}';`);
}