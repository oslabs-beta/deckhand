const deploymentControllerController = require('../../../server/controllers/deploymentController.js');

// @ts-expect-error TS(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Testing the build functionality', () => {

  const req = {
    body: {
      repo: 'bob/awesomeGame'
    }
  };
  const res = {
    locals: {}
  };
  // @ts-expect-error TS(2708) FIXME: Cannot use namespace 'jest' as a value.
  const next = jest.fn();

  // @ts-expect-error TS(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('The name of the awsRepo', async () => {
    const whatRepoShouldBe = 'bob-awesomegame';
    const awsRepo = req.body.repo.split('/').join('-').toLowerCase();
    // @ts-expect-error TS(2552) FIXME: Cannot find name 'expect'. Did you mean 'exec'?
    expect(awsRepo).toBe(whatRepoShouldBe);
  });

});