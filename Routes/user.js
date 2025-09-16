const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const warpAsync = require("../utils/warpAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", warpAsync(userController.singup));

router.get("/login", userController.loginUser);

router.post("/login",saveRedirectUrl , passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.loggedIn);

router.get("/logout", userController.loggedOut);

module.exports = router;
