const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

import { Request, Response } from 'express';

router.post('/addVPC', deploymentController.addVPC, (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.post(
  '/deleteVPC',
  deploymentController.deleteVPC,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.post(
  '/addCluster',
  deploymentController.addCluster,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

router.post(
  '/deleteCluster',
  deploymentController.deleteCluster,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.post(
  '/buildImage',
  deploymentController.buildImage,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

router.post(
  '/deleteImage',
  deploymentController.deleteImage,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.post(
  '/deployPod',
  deploymentController.deployPod,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.post(
  '/deletePod',
  deploymentController.deletePod,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.post('/getURL', deploymentController.getURL, (req: Request, res: Response) => {
  res.status(200).json(res.locals.data);
});

module.exports = router;
