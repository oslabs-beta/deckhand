const express = require('express');
const router = express.Router();
const awsEcrController = require('../controllers/awsEcrController');

// creates the repository in AWS ECR

router.post('/repositoryMaker', awsEcrController.repositoryMaker, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

// Pushes the image already built or we can make one (such as a Github repo with a Dockerfile) and push it up.

router.post('/imagePusher', awsEcrController.imagePusher, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

module.exports = router;