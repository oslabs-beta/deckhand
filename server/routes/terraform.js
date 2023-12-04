const express = require('express');
const router = express.Router();
const terraformController = require('../controllers/terraformController');

router.post('/addProject', terraformController.addProject, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/deleteProject', terraformController.deleteProject, (req, res) => {
  res.sendStatus(200);
});

router.post('/addCluster', terraformController.addCluster, (req, res) => {
  res.status(200).json(res.locals.data);
});

router.post('/deleteCluster', terraformController.deleteCluster, (req, res) => {
  res.sendStatus(200);
});

router.post('/configureCluster', terraformController.configureCluster, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
