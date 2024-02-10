// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'express'.
const express = require('express');
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'router'.
const router = express.Router();
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'deployment... Remove this comment to see the full error message
const deploymentController = require('../controllers/deploymentController');

// @ts-expect-error TS(2339) FIXME: Property 'addVPC' does not exist on type '{}'.
router.post('/addVPC', deploymentController.addVPC, (req: any, res: any) => {
  res.sendStatus(200);
});

// @ts-expect-error TS(2339) FIXME: Property 'deleteVPC' does not exist on type '{}'.
router.post('/deleteVPC', deploymentController.deleteVPC, (req: any, res: any) => {
  res.sendStatus(200);
});

// @ts-expect-error TS(2339) FIXME: Property 'addCluster' does not exist on type '{}'.
router.post('/addCluster', deploymentController.addCluster, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

router.post(
  '/deleteCluster',
  // @ts-expect-error TS(2339) FIXME: Property 'deleteCluster' does not exist on type '{... Remove this comment to see the full error message
  deploymentController.deleteCluster,
  (req: any, res: any) => {
    res.sendStatus(200);
  }
);

// @ts-expect-error TS(2339) FIXME: Property 'buildImage' does not exist on type '{}'.
router.post('/buildImage', deploymentController.buildImage, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

// @ts-expect-error TS(2339) FIXME: Property 'deleteImage' does not exist on type '{}'... Remove this comment to see the full error message
router.post('/deleteImage', deploymentController.deleteImage, (req: any, res: any) => {
  res.sendStatus(200);
});

// @ts-expect-error TS(2339) FIXME: Property 'deployPod' does not exist on type '{}'.
router.post('/deployPod', deploymentController.deployPod, (req: any, res: any) => {
  res.sendStatus(200);
});

// @ts-expect-error TS(2339) FIXME: Property 'deletePod' does not exist on type '{}'.
router.post('/deletePod', deploymentController.deletePod, (req: any, res: any) => {
  res.sendStatus(200);
});

// @ts-expect-error TS(2339) FIXME: Property 'getURL' does not exist on type '{}'.
router.post('/getURL', deploymentController.getURL, (req: any, res: any) => {
  res.status(200).json(res.locals.data);
});

module.exports = router;
