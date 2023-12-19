const request = require('supertest');
const githubController = require('../../../server/controllers/githubController.js');

describe('testing Github callback component', () => {

  const req = {
    body: {},
    query: {code: 'ur5j49dk2or5z34hg4p9'}
  };
  const res = {
    locals: {}
  }
  const next = jest.fn();

  it('check if query code token is in the request', () => {
    githubController.callback(req, res, next);
    expect(req.query.code).toHaveLength(20);
    expect(req.query.code).not.toBeUndefined();
  });

});

describe('Scan dockerfile tests', () => {
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

describe('Scan envs tests', () => {
  const req = {
    body: {},
  };
  const res = {
    locals: {},
  };
  const next = jest.fn();

  it('Should return undefined if github repo not found', () => {
    req.body.repo = 'denniscorsi/xxxxx';
    req.body.branch = 'main';
    githubController.scanRepo(req, res, next);
    expect(res.locals.envs).toBeUndefined();
  });

  it('Should return an empty array if there are no env variables', () => {});

  it('Should return env variables from root directory', () => {});

  it('Should return env variables from nested directory', () => {});
});
