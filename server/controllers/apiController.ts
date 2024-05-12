const db = require('../database/dbConnect');
const cryptoUtils = require('../utils/cryptoUtils');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const apiController: any = {};

apiController.updateDatabase = async (req: any, res: any, next: any) => {
  const { id, name, email, avatarUrl, githubId, theme, awsAccessKey, awsSecretKey, state } = req.body;

  // Prepare the SQL query
  const updateQuery = `
    UPDATE users
    SET name = $2, email = $3, avatarurl = $4, githubid = $5, theme = $6, awsaccesskey = $7, awssecretkey = $8, state = $9
    WHERE _id = $1
    RETURNING *
  `;

  try {
    // Execute the query with the provided values
    const result: any = await db.query(updateQuery, [
      id,
      name,
      email,
      avatarUrl,
      githubId,
      theme,
      awsAccessKey ? cryptoUtils.encrypt(awsAccessKey) : null,
      awsAccessKey ? cryptoUtils.encrypt(awsSecretKey) : null,
      JSON.stringify(state),
    ]);

    if (result.rows.length === 0) {
      throw new Error('User not found.');
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
