const apiController = require('../../../server/controllers/apiController.js');

describe('Testing the functionality of the "pushDockerHubImagesToKluster" method', () => {

  const req = {
    body: {}
  };
  const res = {
    locals: {}
  };
  const next = jest.fn();

  it('See if image architecture is incorrect', async () => {
    req.body.repo_name = 'deckhandapp';
    req.body.image = 'ideastation';
    req.body.tag = '1';
    return expect(apiController.pushDockerHubImagesToKluster(req, res, next)).resolves.toBe("Wrong type of image architecture");
  });

  it('See if image architecture is correct', async () => {
    req.body.repo_name = 'library';
    req.body.image = 'mongo';
    req.body.tag = 'latest';
    return expect(apiController.pushDockerHubImagesToKluster(req, res, next)).resolves.not.toBe("Wrong type of image architecture");
  });

  it('See if image port is found and correct', async () => {
    req.body.repo_name = 'library';
    req.body.image = 'mongo';
    req.body.tag = 'latest';
    apiController.pushDockerHubImagesToKluster(req, res, next)
    return expect(res.locals.data).toEqual({"imagePort": 27017});
  });

  it('See if image port is found and expected is incorrect', async () => {
    req.body.repo_name = 'library';
    req.body.image = 'mongo';
    req.body.tag = 'latest';
    apiController.pushDockerHubImagesToKluster(req, res, next)
    return expect(res.locals.data).not.toEqual({"imagePort": 3000});
  });

});
