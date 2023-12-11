const apiController = {};

apiController.getProjects = (req, res, next) => {
  next();
};

apiController.getDockerHubImages = async (req, res, next) => {
  //"https://hub.docker.com/v2/repositories/library/?page_size=175"
  await fetch('https://hub.docker.com/v2/repositories/deckhandapp/odinolson17-main1/tags')
    .then((res) => res.json())
    .then((data) => {
      console.log('inner data', data);
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

apiController.getDockerHubImageTags = async (req, res, next) => {
  //`https://hub.docker.com/v2/repositories/library/${image}/tags/`
  //'https://hub.docker.com/v2/repositories/deckhandapp/main/tags'
  console.log('end', req.params.image[req.params.image.length - 1]);
  console.log('image', req.params.image);
  const { image } = req.params;
  await fetch(`https://hub.docker.com/v2/repositories/deckhandapp/${image}/tags`)
    .then((res) => res.json())
    .then((data) => {
      // console.log('inside this', data)
      res.locals.data = data.results.map((el) => el.name)
      next();
    })
    .catch((error) => next(error));
};

module.exports = apiController;
