const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.post('/login', githubController.login, (req, res) => {
  res.status(200)//.json(res.locals.data);
});

module.exports = router;
