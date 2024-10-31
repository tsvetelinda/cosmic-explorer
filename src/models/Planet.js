import { Schema, model, Types } from 'mongoose';

const planetSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The planet name is required!'],
        minLength: [2, 'The name should be at least 2 characters!']
    },
    age: {
        type: Number,
        required: [true, 'The planet age is required!'],
        min: [0, 'The age should be a positive number!']
    },
    solarSystem: {
        type: String,
        required: [true, 'The solar system is required!'],
        minLength: [2, 'The solar system should be at least 2 characters!']
    },
    type: {
        type: String,
        enum: {
            values: ['Inner', 'Outer', 'Dwarf'],
            message: 'The provided planet type is not allowed!'
        },
        default: null
    },
    moons: {
        type: Number,
        required: [true, 'The number of moons is required!'],
        min: [0, 'The moons should be a positive number!']
    },
    size: {
        type: Number,
        required: [true, 'The planet size is required!'],
        min: [1, 'The size should be a positive number!']
    },
    rings: {
        type: String,
        enum: {
            values: ['Yes', 'No'],
            message: 'The provided value is not allowed!'
        },
        default: null
    },
    description: {
        type: String,
        required: [true, 'The planet description is required!'],
        minLength: [10, 'The description should be at least 10 characters!'],
        maxLength: [100, 'The description should be less than 100 characters!']
    },
    image: {
        type: String,
        required: [true, 'The planet image is required!'],
        validate: [/https?:\/\//, 'The image URL should start with http:// or https://!']
    },
    likedList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Planet = model('Planet', planetSchema);

export default Planet;