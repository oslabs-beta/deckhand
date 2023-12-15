const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/', apiController.getProjects, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.get('/dockerHubImages/*', apiController.getDockerHubImages, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/dockerHubImageTags/:image', apiController.getDockerHubImageTags, (req, res) => {
  res.status(200).json(res.locals.data);
});

// for personal docker hub images

router.get('/usersDockerHubImages', apiController.getUsersDockerHubImages, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/usersDockerHubImageTags/*', apiController.getUsersDockerHubImageTags, (req, res) => {
  res.status(200).json(res.locals.data);
});

module.exports = router;
