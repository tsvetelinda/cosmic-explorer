import { Router } from 'express';
import { isAuth, isGuest } from '../middlewares/authMiddleware.js';
import { getErrorMessage } from '../utils/errorUtils.js';
import planetService from '../services/planetService.js';

const router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('planets/create', { title: 'Add New Planet' });
});

router.post('/create', isAuth, async (req, res) => {
    const planet = req.body;
    const ownerId = req.user._id;

    try {
        await planetService.create(planet, ownerId);
        res.redirect('/catalog');
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('planets/create', { title: 'Add New Planet', error, planet });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        const planets = await planetService.getAll().lean();
        res.render('planets/catalog', { title: 'Planet Catalog', planets });
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('home/404', { title: '404 - Page Not Found', error });
    }
});

router.get('/:id/details', async (req, res) => {
    const planetId = req.params.id;
    const userId = req.user?._id;

    try {
        const planet = await planetService.getOne(planetId).lean();
        const isOwner = userId === planet.owner.toString();
        const hasVoted = planet.likedList.map(id => id.toString()).includes(userId);

        res.render('planets/details', { title: 'Planet Details', planet, isOwner, hasVoted });
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('home/404', { title: '404 - Page Not Found', error });
    }
});

router.get('/:id/like', isAuth, async (req, res) => {
    const planetId = req.params.id;
    const userId = req.user?._id;
    const planet = await planetService.getOne(planetId);
    const isOwner = userId === planet.owner.toString();

    if (isOwner) {
        return res.redirect(`/${planetId}/details`);
    }

    try {
        await planetService.like(planetId, userId);
        res.redirect(`/${planetId}/details`);
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('home/404', { title: '404 - Page Not Found', error });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    const planetId = req.params.id;
    const userId = req.user?._id;
    const planet = await planetService.getOne(planetId);
    const isOwner = userId === planet.owner.toString();

    if (!isOwner) {
        return res.redirect(`/${planetId}/details`);
    }

    try {
        await planetService.del(planetId);
        res.redirect('/catalog');
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('home/404', { title: '404 - Page Not Found', error });
    }
});

router.get('/:id/edit', isAuth, async (req, res) => {
    const planetId = req.params.id;
    const planet = await planetService.getOne(planetId).lean();
    const userId = req.user?._id;
    const isOwner = userId === planet.owner.toString();

    if (!isOwner) {
        return res.redirect(`/${planetId}/details`);
    }

    res.render('planets/edit', { title: 'Edit Planet', planet });
});

router.post('/:id/edit', isAuth, async (req, res) => {
    const planetId = req.params.id;
    const planet = await planetService.getOne(planetId).lean();
    const userId = req.user?._id;
    const isOwner = userId === planet.owner.toString();
    const editedData = req.body;

    if (!isOwner) {
        return res.redirect(`/${planetId}/details`);
    }

    try {
        await planetService.edit(planetId, editedData);
        res.redirect(`/${planetId}/details`);
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('planets/edit', { title: 'Edit Planet', error, planet: editedData });
    }
});

router.get('/search', async (req, res) => {
    const query = req.query;

    try {
        const planets = await planetService.getAll(query).lean();
        res.render('planets/search', { title: 'Planet Search', planets, query });
    } catch(err) {
        const error = getErrorMessage(err);
        
        res.render('home/404', { title: '404 - Page Not Found', error });
    }
});

export default router;