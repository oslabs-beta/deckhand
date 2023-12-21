const db = require('../data/model.js');

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

module.exports = apiController;
