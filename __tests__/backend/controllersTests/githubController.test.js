const request = require('supertest');
const githubController = require('../../../server/controllers/githubController.js');

describe('testing Github callback component', () => {

  test('check if query code token is in the request', () => {
    const req = {query: {code: 'ur5j49dk2or5z34hg4p9'}};
    expect(req.query.code).toHaveLength(20);
  });

});