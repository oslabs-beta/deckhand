const apiController = {};

apiController.getProjects = (req, res, next) => {
  next();
};

apiController.getDockerHubImages = async (req, res, next) => {
  await fetch("https://hub.docker.com/v2/repositories/library/")
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

module.exports = apiController;
