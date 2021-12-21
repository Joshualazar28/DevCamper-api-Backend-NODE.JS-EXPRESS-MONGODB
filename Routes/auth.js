const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    ForgetPassword,
    resetPassword,
    updateDetails,
    updatePassword

} = require('../controllers/auth');


const router = express.Router();
const { protect } = require('../Middleware/auth')

router.post('/register', register);
router.post('/login', login)
router.get('/logout', logout);
router.get('/me', protect, getMe)
router.post('/forgetpassword', ForgetPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updateDetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);




module.exports = router;
