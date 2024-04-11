import { Request, Response, NextFunction } from 'express';
const apiController = require('../../../server/controllers/apiController');

describe('Testing the functionality of the "getDockerHubExposedPort" method', () => {

  interface DockerRequest {
    imageName: string;
    imageTag: string;
  }

  const req: Request & { body: DockerRequest } = {
    body: {} as DockerRequest,
  } as Request;

  const res: Response & { locals: any } = {
    locals: {},
  } as Response;

  const next: NextFunction = jest.fn();

  it('See if image architecture is incorrect', async () => {
    req.body.imageName = 'deckhandapp/ideastation';
    req.body.imageTag = '1';
    return expect(apiController.getDockerHubExposedPort(req, res, next)).resolves.toBe("Wrong type of image architecture");
  }, 180000);

  it('See if image architecture is correct', async () => {
    req.body.imageName = 'nginx';
    req.body.imageTag = 'latest';
    return expect(apiController.getDockerHubExposedPort(req, res, next)).resolves.not.toBe("Wrong type of image architecture");
  }, 180000);

  it('See if image port is found and correct', async () => {
    req.body.imageName = 'nginx';
    req.body.imageTag = 'latest';
    apiController.getDockerHubExposedPort(req, res, next)
    return expect(res.locals.data).toEqual({ "exposedPort": 80 });
  }, 180000);

  it('See if image port is found and expected is incorrect', async () => {
    req.body.imageName = 'nginx';
    req.body.imageTag = 'latest';
    apiController.getDockerHubExposedPort(req, res, next)
    return expect(res.locals.data).not.toEqual({ "exposedPort": 3000 });
  }, 180000);

});
