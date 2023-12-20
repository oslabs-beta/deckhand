const { execSync, exec } = require('child_process');
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
    execSync(`docker image pull --platform linux/amd64 ${repo_name}/${image}:${tag}`);
  } catch {
    return 'Wrong type of image architecture';
  }
  const imageInformation = execSync(`docker image inspect ${repo_name}/${image}:${tag}`, {
    encoding: 'utf8',
  });
  const imageInformationAsJSON = JSON.parse(imageInformation);
  // this shows us the architecture of the image. If not the correct type (linux/amd64 aka amd64), then it should tell user image is of wrong type. Docker Hub (to my knowledge) doesn't let you rewrite someone elses docker hub images to change the architecture. 
  console.log(imageInformationAsJSON);
  console.log('show arch', imageInformationAsJSON[0].Architecture);

  const imageArchitecture = imageInformationAsJSON[0].Architecture;
  // this gives us the port in an object 
  console.log('show port', imageInformationAsJSON[0].Config.ExposedPorts);

  const imagePortAsAnObject = imageInformationAsJSON[0].Config.ExposedPorts;
  const imagePortAsAKey = Object.keys(imagePortAsAnObject);

  console.log(imagePortAsAKey);

  const imagePortAsString = imagePortAsAKey[0].match(/\d+/g);
  const imagePort = Number(imagePortAsString);

  console.log(imagePort);

  return next();
};

module.exports = apiController;
