const express = require("express");
const router = express.Router();
const API = require("../controllers/api");
const serverMessages = require("../config/server-messages");
const jwt = require("jsonwebtoken");
const secret = require("../config/keys").SECRET;

router.get("/", API.homeRoute);
router.post("/user/register", API.registerUser);
router.post("/user/login", API.loginUser);
router.get("/users", verifyToken, API.getAllUsers);
router.get("/myprofile", verifyToken, API.getMyProfile);
router.patch("/user/update/:id", verifyToken, API.updateUserById);

function verifyToken(req, res, next) {
    try {
        // getting token from request header
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(" ")[1];
            jwt.verify(bearerToken, secret, (err, authData) => {
                if(err) {
                    res.status(200).json({ type: "error", message: serverMessages.E_LOGIN_1 });
                }
                // token verified, pass auth data to next()
                req.authData = authData;
            })
            next();
        } else {
            res.status(200).json({ type: "error", message: serverMessages.E_LOGIN_1 });
        }
    }
    catch(e) {
        res.status(500).json({ type: "error", message: `${serverMessages.E_SERVER}: ${e.message}` });
    }
}

module.exports = router;