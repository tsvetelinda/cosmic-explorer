import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from '../lib/jwt.js';

async function register(username, email, password, rePassword) {
    if (password !== rePassword) {
        throw new Error('Password mismatch!');
    }

    const user = await User.findOne({ $or: [{ email }, { username }] }).lean();

    if (user) {
        throw new Error('User is already registered!');
    }

    const newUser = await User.create({ username, email, password });
    return generateToken(newUser);
} 

async function login(username, password) {
    if (username === '') {
        throw new Error('The username field is empty!');
    }

    if (password === '') {
        throw new Error('The password field is empty!');
    }

    const user = await User.findOne({ username }).lean();

    if (!user) {
        throw new Error('User does not exist!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('The password is not correct!');
    }

    return generateToken(user);
}

async function generateToken(user) {
    const payload = {  
        _id: user._id,
        email: user.email,
        username: user.username
    };
    const header = { expiresIn: '2h'};

    const token = await jwt.sign(payload, process.env.JWT_SECRET, header);
    
    return token;
}

const authService = {
    register,
    login
};

export default authService;