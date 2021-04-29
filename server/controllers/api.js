const User = require("../models/User");
const serverMessages = require("../config/server-messages");
const bcrypt = require("bcryptjs");

module.exports = class API {
    static async homeRoute(req, res) {
        res.send("hello from API");
    }

    static async registerUser(req, res) {
        const userName = req.body.UserName;
        const userEmail = req.body.UserEmail;
        const userPass1 = req.body.UserPass1;
        const userPass2 = req.body.UserPass2;
        const userRole = req.body.UserRole;

        if(userPass1 !== userPass2) {
            // checking passwords matching
            res.status(400).json({ type: "error", message: serverMessages.E_PASSWORD_1 });
        }

        if(checkUserName(userName) && checkUserEmail(userEmail) && checkUserRole(userRole)) {
            User.findOne( {UserEmail: userEmail })
                .then( (user) => {
                    if(user) {
                        // user already exists
                        res.status(400).json({ type: "info", message: serverMessages.I_EMAIL });
                    } else {
                        // save user to db
                        const newUser = new User({
                            UserName: userName,
                            UserEmail: userEmail,
                            UserPass: userPass1,
                            UserRole: userRole
                        });

                        // hashing password to save password in encrypted form
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.UserPass, salt, (err, hash) => {
                                if(err) res.send(500).json({ type: "error", message: `${serverMessages.E_SERVER}: ${err.message}` });
                                
                                newUser.UserPass = hash;

                                newUser.save()
                                    .then( () => {
                                        res.status(200).json({ type: "success", message: serverMessages.S_USER_1 });
                                    })
                                    .catch( (err) => {
                                        res.status(500).json({ type: "error", message: `${serverMessages.E_SERVER}: ${err.message}` });
                                    })
                            });
                        });
                    }
                })
                .catch( (err) => {
                    res.status(500).json({ type: "error", message: `${serverMessages.E_SERVER}: ${err.message}` });
                });
        } else {
            res.status(400).json({ type: "error", message: serverMessages.E_DATA_1 });
        }
    }

    static async loginUser(req, res) {
        const userEmail = req.body.UserEmail || "";
        const userPass = req.body.UserPass || "";

        if(userEmail != "" && userPass != "") {
            User.findOne( {UserEmail: userEmail })
                .then( (user) => {
                    if(!user) {
                        // user not found
                        res.status(400).json({ type: "error", message: serverMessages.E_EMAIL });
                    } else {
                        // comparing the hashed password
                        bcrypt.compare(userPass, user.UserPass, (err, isMatch) => {
                            if(err) {
                                res.status(500).json({ type: "error", message: `${serverMessages.E_SERVER}: ${err.message}` });
                            } else {
                                if(isMatch) {
                                    res.status(200).json({ type: "success", message: "Login success. Please await token." });
                                } else {
                                    res.status(400).json({ type: "error", message: serverMessages.E_LOGIN });
                                }
                            }
                        })
                    }
                })
        } else {
            res.status(400).json({ type: "error", message: serverMessages.E_DATA_1 });
        }
    }
}

// helper functions
function checkUserName(name) {
    return name.length > 0 && name.length <= 100;
}

function checkUserEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkUserRole(role) {
    return role == "ADMIN" || role == "DEV" || role == "TEST";
}