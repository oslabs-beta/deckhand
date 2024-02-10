// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'express'.
const express = require('express');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
const router = express.Router();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'deployment... Remove this comment to see the full error message
const deploymentController = require('../controllers/deploymentController');

router.post('/addVPC', deploymentController.addVPC, (req: any, res: any) => {
  res.sendStatus(200);
});

router.post('/deleteVPC', deploymentController.deleteVPC, (req: any, res: any) => {
  res.sendStatus(200);
});

router.post('/addCluster', deploymentController.addCluster, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.post(
  '/deleteCluster',
  deploymentController.deleteCluster,
  (req: any, res: any) => {
    res.sendStatus(200);
  }
);

router.post('/buildImage', deploymentController.buildImage, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.post('/deleteImage', deploymentController.deleteImage, (req: any, res: any) => {
  res.sendStatus(200);
});

router.post('/deployPod', deploymentController.deployPod, (req: any, res: any) => {
  res.sendStatus(200);
});

router.post('/deletePod', deploymentController.deletePod, (req: any, res: any) => {
  res.sendStatus(200);
});

router.post('/getURL', deploymentController.getURL, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

module.exports = router;
