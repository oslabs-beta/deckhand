const apiController = require('../../../server/controllers/apiController.js');

describe('Testing the functionality of the "getDockerHubExposedPort" method', () => {

  const req = {
    body: {}
  };
  const res = {
    locals: {}
  };
  const next = jest.fn();

  it('See if image architecture is incorrect', async () => {
    req.body.imageName = 'deckhandapp/ideastation';
    req.body.imageTag = '1';
    return expect(apiController.getDockerHubExposedPort(req, res, next)).resolves.toBe("Wrong type of image architecture");
  }, 180000);

  it('See if image architecture is correct', async () => {
    req.body.imageName = 'mongo';
    req.body.imageTag = 'latest';
    return expect(apiController.getDockerHubExposedPort(req, res, next)).resolves.not.toBe("Wrong type of image architecture");
  }, 180000);

  it('See if image port is found and correct', async () => {
    req.body.imageName = 'mongo';
    req.body.imageTag = 'latest';
    apiController.getDockerHubExposedPort(req, res, next)
    return expect(res.locals.data).toEqual({ "exposedPort": 27017 });
  }, 180000);

  it('See if image port is found and expected is incorrect', async () => {
    req.body.imageName = 'mongo';
    req.body.imageTag = 'latest';
    apiController.getDockerHubExposedPort(req, res, next)
    return expect(res.locals.data).not.toEqual({ "exposedPort": 3000 });
  }, 180000);

});
