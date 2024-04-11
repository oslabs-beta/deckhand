const cryptoUtils = require('./cryptoUtils');

const migrationQuery = (id: any, awsaccesskey: any, awssecretkey: any) => {
  console.log(`UPDATE users \nSET awsaccesskey = '${cryptoUtils.encrypt(awsaccesskey)}', \nawssecretkey = '${cryptoUtils.encrypt(awssecretkey)}' \nWHERE _id = '${id}';`);
}