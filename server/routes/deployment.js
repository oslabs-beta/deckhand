const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/addProject', deploymentController.addProject, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/deleteProject', deploymentController.deleteProject, (req, res) => {
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

module.exports = router;
