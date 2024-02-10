// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'apiControl... Remove this comment to see the full error message
const apiController = require('../../../server/controllers/apiController.js');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Testing the functionality of the "getDockerHubExposedPort" method', () => {

  const req = {
    body: {}
  };
  const res = {
    locals: {}
  };
  // @ts-expect-error TS(2708): Cannot use namespace 'jest' as a value.
  const next = jest.fn();

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('See if image architecture is incorrect', async () => {
    // @ts-expect-error TS(2339): Property 'imageName' does not exist on type '{}'.
    req.body.imageName = 'deckhandapp/ideastation';
    // @ts-expect-error TS(2339): Property 'imageTag' does not exist on type '{}'.
    req.body.imageTag = '1';
    // @ts-expect-error TS(2552): Cannot find name 'expect'. Did you mean 'exec'?
    return expect(apiController.getDockerHubExposedPort(req, res, next)).resolves.toBe("Wrong type of image architecture");
  }, 180000);

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('See if image architecture is correct', async () => {
    // @ts-expect-error TS(2339): Property 'imageName' does not exist on type '{}'.
    req.body.imageName = 'nginx';
    // @ts-expect-error TS(2339): Property 'imageTag' does not exist on type '{}'.
    req.body.imageTag = 'latest';
    // @ts-expect-error TS(2552): Cannot find name 'expect'. Did you mean 'exec'?
    return expect(apiController.getDockerHubExposedPort(req, res, next)).resolves.not.toBe("Wrong type of image architecture");
  }, 180000);

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('See if image port is found and correct', async () => {
    // @ts-expect-error TS(2339): Property 'imageName' does not exist on type '{}'.
    req.body.imageName = 'nginx';
    // @ts-expect-error TS(2339): Property 'imageTag' does not exist on type '{}'.
    req.body.imageTag = 'latest';
    apiController.getDockerHubExposedPort(req, res, next)
    // @ts-expect-error TS(2552): Cannot find name 'expect'. Did you mean 'exec'?
    return expect(res.locals.data).toEqual({ "exposedPort": 80 });
  }, 180000);

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('See if image port is found and expected is incorrect', async () => {
    // @ts-expect-error TS(2339): Property 'imageName' does not exist on type '{}'.
    req.body.imageName = 'nginx';
    // @ts-expect-error TS(2339): Property 'imageTag' does not exist on type '{}'.
    req.body.imageTag = 'latest';
    apiController.getDockerHubExposedPort(req, res, next)
    // @ts-expect-error TS(2552): Cannot find name 'expect'. Did you mean 'exec'?
    return expect(res.locals.data).not.toEqual({ "exposedPort": 3000 });
  }, 180000);

});
