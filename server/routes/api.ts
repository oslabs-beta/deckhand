// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'express'.
const express = require('express');
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'router'.
const router = express.Router();
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'apiControl... Remove this comment to see the full error message
const apiController = require('../controllers/apiController');

router.post('/updateDatabase', apiController.updateDatabase, (req: any, res: any) => {
  res.sendStatus(200)//.json(res.locals.data);
});

router.get('/dockerHubImages/*', apiController.getDockerHubImages, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.get('/dockerHubImageTags/*', apiController.getDockerHubImageTags, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.post('/getDockerHubExposedPort', apiController.getDockerHubExposedPort, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

module.exports = router;
