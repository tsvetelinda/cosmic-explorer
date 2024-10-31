import { Router } from 'express';

import homeController from './controllers/homeController.js';
import authController from './controllers/authController.js';
import planetController from './controllers/planetController.js';

const router = Router();

router.use(homeController);
router.use(authController);
router.use(planetController);

router.all('*', (req, res) => {
    res.render('home/404', { title: '404 - Page Not Found' });
});

export default router;