const request = require('supertest');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'githubCont... Remove this comment to see the full error message
const githubController = require('../../../server/controllers/githubController.js');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Testing the Github Oauth Login Redirect', () => {
  const req = {
    body: {},
  };
  const res = {
    locals: {},
    // @ts-expect-error TS(2708): Cannot use namespace 'jest' as a value.
    redirect: jest.fn()
  };
  // @ts-expect-error TS(2708): Cannot use namespace 'jest' as a value.
  const next = jest.fn();

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Does it make only one request', () => {
    githubController.login(req, res, next);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.redirect.mock.calls.length).toBe(1);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.redirect.mock.calls.length).not.toBe(0);
  });

});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Scan dockerfile tests', () => {
  const req = {
    body: {},
  };
  const res = {
    locals: {},
  };
  // @ts-expect-error TS(2708): Cannot use namespace 'jest' as a value.
  const next = jest.fn();

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should return undefined if there is no dockerfile', () => {
    // @ts-expect-error TS(2339): Property 'repo' does not exist on type '{}'.
    req.body.repo = 'denniscorsi/envs';
    // @ts-expect-error TS(2339): Property 'branch' does not exist on type '{}'.
    req.body.branch = 'main';
    githubController.findExposedPort(req, res, next);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.locals.data.exposedPort).toEqual(undefined);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should return undefined if there is no exposed port in the dockerfile', () => {
    // @ts-expect-error TS(2339): Property 'repo' does not exist on type '{}'.
    req.body.repo = 'denniscorsi/envs';
    // @ts-expect-error TS(2339): Property 'branch' does not exist on type '{}'.
    req.body.branch = 'empty-docker';
    githubController.findExposedPort(req, res, next);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.locals.data.exposedPort).toEqual(undefined);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should return exposed port if there is one in the dockerfile', () => {
    // @ts-expect-error TS(2339): Property 'repo' does not exist on type '{}'.
    req.body.repo = 'denniscorsi/envs';
    // @ts-expect-error TS(2339): Property 'branch' does not exist on type '{}'.
    req.body.branch = 'docker';
    githubController.findExposedPort(req, res, next);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.locals.data.exposedPort).toEqual(3000);
  });
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Scan envs tests', () => {
  const req = {
    body: {},
  };
  const res = {
    locals: {},
  };
  // @ts-expect-error TS(2708): Cannot use namespace 'jest' as a value.
  const next = jest.fn();

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should return undefined if github repo not found', () => {
    // @ts-expect-error TS(2339): Property 'repo' does not exist on type '{}'.
    req.body.repo = 'denniscorsi/xxxxx';
    // @ts-expect-error TS(2339): Property 'branch' does not exist on type '{}'.
    req.body.branch = 'main';
    githubController.scanRepo(req, res, next);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.locals.envs).toBeUndefined();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should return an empty array if there are no env variables', () => {
    // @ts-expect-error TS(2339): Property 'repo' does not exist on type '{}'.
    req.body.repo = 'denniscorsi/envs';
    // @ts-expect-error TS(2339): Property 'branch' does not exist on type '{}'.
    req.body.branch = 'no-envs';
    githubController.scanRepo(req, res, next);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.locals.envs).toEqual([]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should return env variables from root directory', () => {
    // @ts-expect-error TS(2339): Property 'repo' does not exist on type '{}'.
    req.body.repo = 'denniscorsi/envs';
    // @ts-expect-error TS(2339): Property 'branch' does not exist on type '{}'.
    req.body.branch = 'nonnested';
    githubController.scanRepo(req, res, next);
    const expected = [
      'BRANCHVALUE',
      'python1',
      'python_2',
      '$php_variable',
      '$anotherPhp',
    ].sort();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.locals.envs.sort()).toEqual(expected);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Should return env variables from nested directory', () => {
    // @ts-expect-error TS(2339): Property 'repo' does not exist on type '{}'.
    req.body.repo = 'denniscorsi/envs';
    // @ts-expect-error TS(2339): Property 'branch' does not exist on type '{}'.
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
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.locals.envs.sort()).toEqual(expected);
  });
});
