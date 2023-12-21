const db = require('../data/model.js');
const { execSync, exec } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);

const apiController = {};

apiController.updateDatabase = async (req, res, next) => {
  const { id, name, email, avatarUrl, githubId, awsAccessKey, awsSecretKey, state } = req.body;

  // Prepare the SQL query
  const updateQuery = `
    UPDATE users
    SET name = $2, email = $3, avatarUrl = $4, githubId = $5, awsAccessKey = $6, awsSecretKey = $7, state = $8
    WHERE _id = $1
    RETURNING *
  `;

  try {
    // Execute the query with the provided values
    const result = await db.query(updateQuery, [id, name, email, avatarUrl, githubId, awsAccessKey, awsSecretKey, state]);

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

apiController.getDockerHubImages = async (req, res, next) => {
  const image = req.params[0];
  await fetch(`https://hub.docker.com/v2/search/repositories/?query=${image}`)
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el) => {
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

apiController.getDockerHubImageTags = async (req, res, next) => {
  let image = req.params[0];
  if (!image.includes('/')) image = `library/${image}`
  await fetch(`https://hub.docker.com/v2/repositories/${image}/tags/`)
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

// function to pull docker images from Dockerhub so we can use them in AWS

apiController.pushDockerHubImagesToKluster = async (req, res, next) => {

  // what is needed: the name of the github image to pull
  // for example: deckhandapp/ideastation
  // the tag at the end (without it assumes latest)
  // for example: deckhandapp/ideastation:1 (important since this image has no latest)

  const { repo_name } = req.body;
  const { image } = req.body;
  const { tag } = req.body;

  //could only get the command to work with execSync as of right now

  try {
    await execProm(`docker image pull --platform linux/amd64 ${repo_name}/${image}:${tag}`);
  } catch {
    return 'Wrong type of image architecture';
  }
  const imageInformation = await execProm(`docker image inspect ${repo_name}/${image}:${tag} -f json`);
  const imageInformationAsJSON = JSON.parse(imageInformation.stdout);
  // this gives us the port in an object
  const imagePortAsAnObject = imageInformationAsJSON[0].Config.ExposedPorts;
  const imagePortAsAKey = Object.keys(imagePortAsAnObject);
  const imagePortAsString = imagePortAsAKey[0].match(/\d+/g);

  const imagePort = Number(imagePortAsString);
  // we can switch the name of this if needed. This gives the port number needed for the YAML files for the container port and the target port
  res.locals.data = { imagePort: imagePort };
  return next();
};

module.exports = apiController;
