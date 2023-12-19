const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/login', githubController.login, (req, res) => {
  res.sendStatus(200);
});

router.get('/callback', githubController.callback, (req, res) => {
  res.sendStatus(200);
});

router.get('/logout', githubController.callback, (req, res) => {
  res.sendStatus(200);
});

router.get('/userData', githubController.userData, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.get('/userRepos', githubController.userRepos, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/publicRepos', githubController.publicRepos, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/branches', githubController.branches, (req, res) => {
  res.status(200).json(res.locals.data);
});

// (not currently used) dockerize and push to Docker Hub
router.post('/build', githubController.build, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/scan', githubController.scanRepo, (req, res) => {
  res.status(200).json(res.locals.envs);
});

router.post('/scanPort', githubController.findExposedPort, (req, res) => {
  res.status(200).json(res.locals.port);
});

module.exports = router;
