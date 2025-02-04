const express = require('express');
const { userSignup, userLogin, editProfile, getProfile, forgetPassword, resetPassword } = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/authanticated');
const {upload} = require("../utils/multer");
const router = express.Router();
 
router.post("/signup", upload.single('images'), userSignup);

router.post("/login", userLogin);

router.put("/editProfile/:id", editProfile);

router.get("/profile", isAuthenticated, getProfile);

router.post("/forget/password", forgetPassword);

router.post("/reset/password", isAuthenticated ,resetPassword);


module.exports = router;