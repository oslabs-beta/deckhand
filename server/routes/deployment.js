const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/addVPC', deploymentController.addVPC, (req, res) => {
  res.sendStatus(200);
});

router.post('/deleteVPC', deploymentController.deleteVPC, (req, res) => {
  res.sendStatus(200);
});

router.post('/addCluster', deploymentController.addCluster, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/deleteCluster', deploymentController.deleteCluster, (req, res) => {
  res.sendStatus(200);
});

router.post('/buildImage', deploymentController.buildImage, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/deleteImage', deploymentController.deleteImage, (req, res) => {
  res.sendStatus(200);
});

router.post('/deployPod', deploymentController.deployPod, (req, res) => {
  res.sendStatus(200);
});

router.post('/deletePod', deploymentController.deletePod, (req, res) => {
  res.sendStatus(200);
});

router.post('/getURL', deploymentController.getURL, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
