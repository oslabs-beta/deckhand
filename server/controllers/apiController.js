const apiController = {};

apiController.getProjects = (req, res, next) => {
  next();
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
