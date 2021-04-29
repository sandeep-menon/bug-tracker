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
            res.status(400).json({ type: "error", message: serverMessages.E_PASSWORD_1 });
        }

        if(checkUserName(userName) && checkUserEmail(userEmail) && checkUserRole(userRole)) {
            // res.status(200).json({ type: "success", message: serverMessages.S_USER_1 });
            User.findOne( {UserEmail: userEmail })
                .then( (user) => {
                    if(user) {
                        res.status(400).json({ type: "info", message: serverMessages.I_EMAIL });
                    } else {
                        const newUser = new User({
                            UserName: userName,
                            UserEmail: userEmail,
                            UserPass: userPass1,
                            UserRole: userRole
                        });

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