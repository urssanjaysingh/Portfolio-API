const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
    .get(verifyJWT, requestsController.getAllRequests)
    .post(requestsController.sendRequest); 

router.delete('/:id', verifyJWT, requestsController.deleteRequest); 

module.exports = router;
