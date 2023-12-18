const request = require('supertest');
const githubController = require('../../../server/controllers/githubController.js');

// describe('testing Github callback component', () => {

//   test('check if query code token is in the request', () => {
//     const req = {query: {code: 'ur5j49dk2or5z34hg4p9'}};
//     expect(req.query.code).toHaveLength(20);
//   });

// });

describe('scan tests', () => {
  const req = {
    body: {},
  };
  const res = {
    locals: {},
  };
  const next = jest.fn();

  it('Should return undefined if there is no dockerfile', () => {
    req.body.repo = 'denniscorsi/envs';
    req.body.branch = 'main';
    githubController.findExposedPort(req, res, next);
    expect(res.locals.port).toEqual(undefined);
  });

  it('Should return undefined if there is no exposed port in the dockerfile', () => {
    req.body.repo = 'denniscorsi/envs';
    req.body.branch = 'empty-docker';
    githubController.findExposedPort(req, res, next);
    expect(res.locals.port).toEqual(undefined);
  });

  it('Should return exposed port if there is one in the dockerfile', () => {
    req.body.repo = 'denniscorsi/envs';
    req.body.branch = 'docker';
    githubController.findExposedPort(req, res, next);
    expect(res.locals.port).toEqual(3000);
  });
});
