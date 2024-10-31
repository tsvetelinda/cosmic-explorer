import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Cosmic Explorer' });
});

router.get('/authorized', (req, res) => {
    res.send(req.user);
});

export default router;