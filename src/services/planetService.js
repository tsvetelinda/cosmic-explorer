import Planet from '../models/Planet.js';

const create = function(planet, ownerId) {
    if (planet.type === '---') {
        planet.type = null;
    }

    if (planet.rings === '---') {
        planet.rings = null;
    }
    
    return Planet.create({ ...planet, owner: ownerId });
}

const getAll = function(filter = {}) {
    const query = Planet.find();

    if (filter.name) {
        query.find({ name: { $regex: filter.name, $options: 'i' } });
    }

    if (filter.solarSystem) {
        query.find({ solarSystem: { $regex: filter.solarSystem, $options: 'i' } });
    }

    return query;
}

const getOne = (planetId) => Planet.findById(planetId);

const like = (planetId, userId) => Planet.findByIdAndUpdate(planetId, { $push: { likedList: userId } });

const del = (planetId) => Planet.findByIdAndDelete(planetId);

const edit = function(planetId, editedData) {
    if (editedData.type === '---') {
        editedData.type = null;
    }

    if (editedData.rings === '---') {
        editedData.rings = null;
    }
    
    return Planet.findByIdAndUpdate(planetId, editedData, { runValidators: true });
}

export default {
    create,
    getAll,
    getOne,
    like,
    del,
    edit
}