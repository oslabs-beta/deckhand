// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'db'.
const db = require('../database/dbConnect.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cryptoUtil... Remove this comment to see the full error message
const cryptoUtils = require('../utils/cryptoUtils.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'exec'.
const { exec } = require('child_process');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'util'.
const util = require('util');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'execAsync'... Remove this comment to see the full error message
const execAsync = util.promisify(exec);

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'apiControl... Remove this comment to see the full error message
const apiController = {};

apiController.updateDatabase = async (req: any, res: any, next: any) => {
  const { id, name, email, avatarUrl, githubId, theme, awsAccessKey, awsSecretKey, state } = req.body;

  // Prepare the SQL query
  const updateQuery = `
    UPDATE users
    SET name = $2, email = $3, avatarUrl = $4, githubId = $5, theme = $6, awsAccessKey = $7, awsSecretKey = $8, state = $9
    WHERE _id = $1
    RETURNING *
  `;

  try {
    // Execute the query with the provided values
    const result = await db.query(updateQuery, [
      id,
      name,
      email,
      avatarUrl,
      githubId,
      theme,
      cryptoUtils.encrypt(awsAccessKey),
      cryptoUtils.encrypt(awsSecretKey),
      state
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return the updated user data
    // res.locals.data = result.rows[0];
    return next();
  } catch (error) {
    next(error)
  }
};

apiController.getDockerHubImages = async (req: any, res: any, next: any) => {
  const image = req.params[0];
  await fetch(`https://hub.docker.com/v2/search/repositories/?query=${image}`)
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el: any) => {
        return {
          name: el.repo_name,
          description: el.short_description,
          stars: el.star_count,
        }
      })
      next();
    })
    .catch((error) => next(error));
};

apiController.getDockerHubImageTags = async (req: any, res: any, next: any) => {
  let imageName = req.params[0];
  if (!imageName.includes('/')) imageName = `library/${imageName}`
  await fetch(`https://hub.docker.com/v2/repositories/${imageName}/tags/`)
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el: any) => el.name)
      next();
    })
    .catch((error) => next(error));
};

apiController.getDockerHubExposedPort = async (req: any, res: any, next: any) => {
  let { imageName, imageTag } = req.body;
  if (!imageName.includes('/')) imageName = `library/${imageName}`

  // Pull docker image
  try {
    await execAsync(`docker image pull --platform linux/amd64 ${imageName}:${imageTag}`);
  } catch {
    return 'Wrong type of image architecture';
  }

  // Inspect image for exposed port
  const imageInfoRaw = await execAsync(`docker image inspect ${imageName}:${imageTag} -f json`);
  const imageInfo = JSON.parse(imageInfoRaw.stdout);
  const exposedPortObj = imageInfo[0].Config.ExposedPorts;
  const exposedPortKey = Object.keys(exposedPortObj);
  const exposedPort = Number(exposedPortKey[0].match(/\d+/g));

  res.locals.data = { exposedPort };
  return next();
};

module.exports = apiController;
