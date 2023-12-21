const request = require('supertest');
const githubController = require('../../../server/controllers/githubController.js');

describe('Testing the Github Oauth Login Redirect', () => {
  const req = {
    body: {},
  };
  const res = {
    locals: {},
    redirect: jest.fn()
  };
  const next = jest.fn();

  it('Does it make only one request', () => {
    githubController.login(req, res, next);
    expect(res.redirect.mock.calls.length).toBe(1);
    expect(res.redirect.mock.calls.length).not.toBe(0);
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

  it('Should return an empty array if there are no env variables', () => {
    req.body.repo = 'denniscorsi/envs';
    req.body.branch = 'no-envs';
    githubController.scanRepo(req, res, next);
    expect(res.locals.envs).toEqual([]);
  });

  it('Should return env variables from root directory', () => {
    req.body.repo = 'denniscorsi/envs';
    req.body.branch = 'nonnested';
    githubController.scanRepo(req, res, next);
    const expected = [
      'BRANCHVALUE',
      'python1',
      'python_2',
      '$php_variable',
      '$anotherPhp',
    ].sort();
    expect(res.locals.envs.sort()).toEqual(expected);
  });

  it('Should return env variables from nested directory', () => {
    req.body.repo = 'denniscorsi/envs';
    req.body.branch = 'testbranch';
    githubController.scanRepo(req, res, next);
    const expected = [
      'C_sharp_var',
      'SECRET',
      '_rubyVar',
      'MONGOURI',
      'value',
      'VALID_VALUE',
      '$VAL',
      'Java$',
      '$php_variable',
      '$anotherPhp',
      'python1',
      'python_2',
      'awskey',
      'BRANCHVALUE',
    ].sort();
    expect(res.locals.envs.sort()).toEqual(expected);
  });
});
