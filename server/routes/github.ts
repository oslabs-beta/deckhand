const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

import { Request, Response } from 'express';

router.get('/login', githubController.login, (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.get(
  '/callback',
  githubController.callback,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.get(
  '/logout',
  githubController.callback,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.get(
  '/userData',
  githubController.userData,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

router.get(
  '/userRepos',
  githubController.userRepos,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

router.post(
  '/publicRepos',
  githubController.publicRepos,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

router.post(
  '/branches',
  githubController.branches,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

// (not currently used) dockerize and push to Docker Hub
router.post('/build', githubController.build, (req: Request, res: Response) => {
  res.status(200).json(res.locals.data);
});

router.post(
  '/scan',
  githubController.scanRepo,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.envs);
  }
);

router.post(
  '/findExposedPort',
  githubController.findExposedPort,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.data);
  }
);

module.exports = router;
