// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'cryptoUtil... Remove this comment to see the full error message
const cryptoUtils = require('./cryptoUtils.js');

const migrationQuery = (id: any, awsaccesskey: any, awssecretkey: any) => {
  console.log(`UPDATE users \nSET awsaccesskey = '${cryptoUtils.encrypt(awsaccesskey)}', \nawssecretkey = '${cryptoUtils.encrypt(awssecretkey)}' \nWHERE _id = '${id}';`);
}