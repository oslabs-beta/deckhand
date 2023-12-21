const deploymentControllerController = require('../../../server/controllers/deploymentController.js');

describe('Testing the build functionality', () => {

  const req = {
    body: {
      repo: 'bob/awesomeGame'
    }
  };
  const res = {
    locals: {}
  };
  const next = jest.fn();

  test('The name of the awsRepo', async () => {
    const whatRepoShouldBe = 'bob-awesomegame';
    const awsRepo = req.body.repo.split('/').join('-').toLowerCase();
    expect(awsRepo).toBe(whatRepoShouldBe);
  });

});