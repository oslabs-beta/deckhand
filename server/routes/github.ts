// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'express'.
const express = require('express');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
const router = express.Router();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'githubCont... Remove this comment to see the full error message
const githubController = require('../controllers/githubController');

router.get('/login', githubController.login, (req: any, res: any) => {
  res.sendStatus(200);
});

router.get('/callback', githubController.callback, (req: any, res: any) => {
  res.sendStatus(200);
});

router.get('/logout', githubController.callback, (req: any, res: any) => {
  res.sendStatus(200);
});

router.get('/userData', githubController.userData, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.get('/userRepos', githubController.userRepos, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.post('/publicRepos', githubController.publicRepos, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.post('/branches', githubController.branches, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

// (not currently used) dockerize and push to Docker Hub
router.post('/build', githubController.build, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.post('/scan', githubController.scanRepo, (req: any, res: any) => {
  res.status(200).json(res.locals.envs);
});

router.post(
  '/findExposedPort',
  githubController.findExposedPort,
  (req: any, res: any) => {
    res.status(200).json(res.locals.data);
  }
);

module.exports = router;
