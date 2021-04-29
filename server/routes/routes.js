const express = require("express");
const router = express.Router();
const API = require("../controllers/api");

router.get("/", API.homeRoute);
router.post("/user/register", API.registerUser);
router.post("/user/login", API.loginUser);

module.exports = router;