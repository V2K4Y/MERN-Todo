const express = require('express');
const { regUser, loginUser, deleteuser, getAllUser, userLogout } = require('../controllers/user');
const { checkAuth } = require('../middlewares/checkAuth');
const router = express.Router();

router.get('/', getAllUser);
router.get('/logout', checkAuth, userLogout);
router.post('/register', regUser);
router.post('/login', loginUser);
router.delete('/delete', deleteuser);

module.exports = router;