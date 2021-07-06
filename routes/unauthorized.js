const express = require('express');
const router = express.Router();
const unauthorizedControllers = require('../controllers/unauthorized');

router.get('/',unauthorizedControllers.getHome);
router.post('/',unauthorizedControllers.postHome);
router.get('/login',unauthorizedControllers.getLogin);
router.post('/login',unauthorizedControllers.postLogin)
router.get('/signup',unauthorizedControllers.getSignUp);
router.post('/signup',unauthorizedControllers.postSignUp);
router.get('/login/:accActivity',unauthorizedControllers.accActivity);
module.exports = router;