const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request');
const authorizedControllers = require('../controllers/authorized');
router.get('/saved',authorizedControllers.saved);
router.post('/saveSearches',authorizedControllers.searches)
router.get('/',authorizedControllers.getHome);
router.post('/',authorizedControllers.postHome);
router.get('/logout',authorizedControllers.logout);
router.post('/searchDelete',authorizedControllers.deleteSearch);
module.exports = router;