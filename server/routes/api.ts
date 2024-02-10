const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

import { Request, Response } from 'express';

router.post(
  '/updateDatabase',
  apiController.updateDatabase,
  (req: Request, res: Response) => {
    res.sendStatus(200); //.json(res.locals.data);
  }
);

router.get(
  '/dockerHubImages/*',
  apiController.getDockerHubImages,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

router.get(
  '/dockerHubImageTags/*',
  apiController.getDockerHubImageTags,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

router.post(
  '/getDockerHubExposedPort',
  apiController.getDockerHubExposedPort,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

module.exports = router;
