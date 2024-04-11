import * as expressModule from 'express';
const router = expressModule.Router();
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
