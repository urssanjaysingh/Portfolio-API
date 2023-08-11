const mongoose = require('mongoose');
const Request = require('../models/Request');

// @desc Get all requests
// @route GET /requests
// @access Private
const getAllRequests = async (req, res) => {
    const requests = await Request.find().lean();
    if (!requests || requests.length === 0) {
        return res.status(404).json({ message: 'No requests found' });
    }
    res.json(requests);
}

// @desc Create new request
// @route POST /requests
// @access Public
const sendRequest = async (req, res) => {
    const { subject, email, message, date } = req.body;

    // Confirm data
    if (!subject || !email || !message || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if a request with the same subject and email already exists
        const existingRequest = await Request.findOne({ subject, email }).collation({ locale: 'en', strength: 2 }).lean();

        if (existingRequest) {
            return res.status(409).json({ message: 'Request with the same subject and email already exists' });
        }

        // Create and store new request
        const newRequest = await Request.create({ subject, email, message, date });

        console.log('Request created:', newRequest); // Add this log

        res.status(201).json({ message: 'Request created successfully', data: newRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Failed to create request' });
    }
}

// @desc Delete a request
// @route DELETE /requests/:id
// @access Private
const deleteRequest = async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL parameter

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Request ID required' });
    }

    try {
        // Confirm request exists to delete
        const request = await Request.findById(id).exec();

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const result = await request.deleteOne();

        const reply = `Request '${request.subject}' with ID ${request._id} deleted`;

        res.json({ message: reply });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ message: 'Failed to delete request' });
    }
}

module.exports = {
    getAllRequests,
    sendRequest,
    deleteRequest
}
