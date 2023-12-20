const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/', apiController.getProjects, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.get('/dockerHubImages/*', apiController.getDockerHubImages, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.get('/dockerHubImageTags/*', apiController.getDockerHubImageTags, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/pushDockerHubImagesToKluster', apiController.pushDockerHubImagesToKluster, (req, res) => {
  res.sendStatus(200)//.json(res.locals.data);
});

module.exports = router;
