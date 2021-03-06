// importing schemas
const User = require("../models/User");
const Defect = require("../models/Defect");

// importing other constants
const serverMessages = require("../config/server-messages");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../config/keys").SECRET;

module.exports = class API {
    static async homeRoute(req, res) {
        res.send("hello from API");
    }

    static async registerUser(req, res) {
        const userName = req.body.UserName || "";
        const userEmail = req.body.UserEmail || "";
        const userPass1 = req.body.UserPass1 || "";
        const userPass2 = req.body.UserPass2 || "";
        const userRole = req.body.UserRole || "";

        if(userPass1 !== userPass2) {
            // checking passwords matching
            res.status(400).json({ type: "error", message: serverMessages.E_PASSWORD_1 });
        }

        if(checkUserName(userName) && checkUserEmail(userEmail) && checkUserRole(userRole)) {
            User.findOne( {UserEmail: userEmail })
                .then( (user) => {
                    if(user) {
                        // user already exists
                        res.status(200).json({ type: "info", message: serverMessages.I_EMAIL });
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
        const userEmail = req.body.UserEmail.toLowerCase() || "";
        const userPass = req.body.UserPass || "";

        if(userEmail != "" && userPass != "") {
            User.findOne( {UserEmail: userEmail })
                .then( (user) => {
                    if(!user) {
                        // user not found
                        res.status(200).json({ type: "error", message: serverMessages.E_EMAIL });
                    } else {
                        // comparing the hashed password
                        bcrypt.compare(userPass, user.UserPass, (err, isMatch) => {
                            if(err) {
                                res.status(500).json({ type: "error", message: `${serverMessages.E_SERVER}: ${err.message}` });
                            } else {
                                if(isMatch) {
                                    // generate token 
                                    let token = jwt.sign({ user: user.UserName, role: user.UserRole, id: user._id }, secret, {expiresIn: 86400});
                                    res.status(200).json({ 
                                        type: "success", 
                                        message: "Login success", 
                                        token: token, 
                                        user: {
                                            user: user.UserName, 
                                            email: user.UserEmail,
                                            role: user.UserRole,
                                            id: user._id
                                        } });
                                } else {
                                    res.status(200).json({ type: "error", message: serverMessages.E_LOGIN });
                                }
                            }
                        })
                    }
                })
        } else {
            res.status(200).json({ type: "error", message: serverMessages.E_DATA_1 });
        }
    }

    static async getAllUsers(req, res) {
        res.status(200).json({ type: "success", message: `User id ${req.authData.id} of name ${req.authData.user} who is ${req.authData.role} is requesting to get all users` });
    }

    static async getMyProfile(req, res) {
        let myId = req.authData.id;

        if(myId != "" && myId != undefined) {
            User.findById( {_id: myId })
                .then((user) => {
                    if(user) {
                        let userData = {
                            id: user._id,
                            name: user.UserName,
                            email: user.UserEmail,
                            role: user.UserRole,
                            about: user.UserAbout
                        }
                        res.status(200).json({ type: "success", userData });
                    } else {
                        res.status(200).json({type: "error", message: "user not found" });
                    }
                })
                .catch((err) => {
                    res.status(500).json({ type: "error", message: serverMessages.E_SERVER });
                })
        }
    }

    static async updateUserById(req, res) {
        let userId = req.params.id;
        const updatedUser = {
            UserName: req.body.updatedUser.name,
            UserEmail: req.body.updatedUser.email,
            UserRole: req.body.updatedUser.role,
            UserAbout: req.body.updatedUser.about,
        }

        
        User.findByIdAndUpdate(userId, updatedUser)
            .then((user) => {
                if(user) {
                    res.status(200).json({ type: "success", message: serverMessages.S_PROFILE_U })
                } else {
                    res.status(200).json({ type: "error", message: serverMessages.E_USER_NF });
                }
            })
            .catch( (err) => {
                console.log(err);
                res.status(500).json({ type: "error", message: serverMessages.E_SERVER });
            })
    }


    /* DEFECT CONTROLLER */
    static async getAllDefects(req, res) {
        try {
            const defects = await Defect.find().sort('-DefDate');
            res.status(200).json({ type: "success", defects });
        } catch (err) {
            res.status(500).json({ type: "error", message: serverMessages.E_SERVER });
        }
    }
    
    static async createDefect(req, res) {

        const newDefect = new Defect({
            DefSummary : req.body.DefSummary,
            DefDescription : req.body.DefDescription,
            DefCreatedBy : req.authData.user
        })
        newDefect.save()
            .then(() => {
                res.status(201).json({ messgae: "OK" });
            })
            .catch((err) => {
                res.status(200).json({ message: err.message });
            })
    }

    static async addCommentToDefectById(req, res) {
        const defectId = req.params.id || "";
        const commentName = req.authData.user || "";
        const commentBody = req.body.comment || "";

        if(defectId == "" || commentName == "" || commentBody == "") {
            res.status(400).json({ type: "error", message: serverMessages.E_DATA_1 });
        } else {
            Defect.findById(defectId)
            .then( (defect) => {
                if(defect) {
                    //let comments = defect.DefComments;
                    let newComment = {
                        DefCommentName: commentName,
                        DefCommentContent: commentBody
                    }
                    //comments.push(newComment);
                    defect.DefComments.push(newComment);

                    //let history = defect.DefHistory;
                    let newHistory = {
                        DefHistoryDetail: getHistoryDetail(commentName, "comment")
                    }
                    //history.push(newHistory);
                    defect.DefHistory.push(newHistory);

                    let updatedDefect = {
                        $set: {
                            DefComments: defect.DefComments,
                            DefHistory: defect.DefHistory,
                        }
                    }
                    Defect.updateOne({ _id: defectId }, updatedDefect, (err, resp) => {
                        if(err) {
                            res.status(500).json({ type: "error", message: serverMessages.E_SERVER });
                        } else {
                            res.status(201).json({ type: "success", message: serverMessages.S_COMMENT_ADD, defect });
                        }
                    })
                } else {
                    res.status(200).json({ type: "error", message: serverMessages.E_DEFECT_NF })
                }
            })
            .catch( (err) => {
                res.status(500).json({ type: "error", message: err.message });
            })
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

function getHistoryDetail(name, action) {
    if(action == "comment") {
        return name + " added a comment.";
    }
}