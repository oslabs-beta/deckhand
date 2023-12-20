const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/addVPC', deploymentController.addVPC, (req, res) => {
  res.status(200).json(res.locals.data);
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

router.post('/configureCluster', deploymentController.configureCluster, (req, res) => {
  res.sendStatus(200);
});

router.post('/build', deploymentController.build, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/destroyImage', deploymentController.destroyImage, (req, res) => {
  res.sendStatus(200);
});

router.post('/getURL', deploymentController.getURL, (req, res) => {
  res.status(200).json(res.locals.address);
});

module.exports = router;
