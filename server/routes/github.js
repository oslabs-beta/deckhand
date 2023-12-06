const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/login', githubController.login, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.get('/callback', githubController.callback, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.get('/userData', githubController.userData, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.get('/userRepos', githubController.userRepos, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.get('/searchRepos', githubController.searchRepos, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/cloneRepo', githubController.cloneRepo, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

module.exports = router;
