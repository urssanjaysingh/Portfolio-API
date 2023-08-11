const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users || users.length === 0) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
}

// @desc Create new user
// @route POST /users
// @access Private
const createUser = async (req, res) => {
    const { username, password } = req.body;

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check for duplicate username
        const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();

        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate username' });
        }

        // Hash password
        const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

        const newUser = await User.create({ username, password: hashedPwd });
        
        console.log('User created:', newUser); // Add this log

        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
}

module.exports = {
    getAllUsers,
    createUser,
};
