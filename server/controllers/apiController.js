const apiController = {};

apiController.getProjects = (req, res, next) => {
  next();
};

apiController.getDockerHubImages = async (req, res, next) => {
  await fetch("https://hub.docker.com/v2/repositories/library/?page_size=175")
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

apiController.getUsersDockerHubImages = async (req, res, next) => {
  await fetch('https://hub.docker.com/v2/repositories/deckhandapp/odinolson17-main1/tags')
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

apiController.getDockerHubImageTags = async (req, res, next) => {
  const { image } = req.params;

  console.log('the image', image);
  console.log('the last letter', image[image.length - 1]);

  await fetch(`https://hub.docker.com/v2/repositories/library/${image}/tags/`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

apiController.getUsersDockerHubImageTags = async (req, res, next) => {
  const { image } = req.params;
  await fetch(`https://hub.docker.com/v2/repositories/deckhandapp/?query=${image}/tags`)
    .then((res) => res.json())
    .then((data) => {
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

module.exports = apiController;
