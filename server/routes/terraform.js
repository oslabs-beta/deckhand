const express = require('express');
const router = express.Router();
const terraformController = require('../controllers/terraformController');

router.post('/addProject', terraformController.addProject, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.post('/deleteProject', terraformController.deleteProject, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.post('/addCluster', terraformController.addCluster, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.post('/deleteCluster', terraformController.deleteCluster, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

router.post('/configureCluster', terraformController.configureCluster, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

module.exports = router;
