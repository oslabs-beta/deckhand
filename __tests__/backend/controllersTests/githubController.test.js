const request = require('supertest');
const githubController = require('../../../server/controllers/githubController.js');

describe('Testing the Github Oauth Login Redirect', () => {
  const req = {
    body: {},
  };
  const res = {
    locals: {},
    redirect: jest.fn()
  }
  const next = jest.fn();

  it('Does it make only one request', () => {
    githubController.login(req, res, next);
    expect(res.redirect.mock.calls.length).toBe(1);
    expect(res.redirect.mock.calls.length).not.toBe(0);
  });

});

// describe('Testing Github callback component', () => {
//   // edit
//   const req = {
//     body: {},
//     query: {}
//   };
//   const res = {
//     locals: {}
//   }
//   const next = jest.fn();

//   it('check if query code token is in the request', async () => {
//     await githubController.callback(req, res, next);
//     const auth_code = req.query.code;
//     expect(auth_code).toHaveLength(20);
//     expect(auth_code).not.toBeUndefined();
//   });

// });

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
