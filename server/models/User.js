const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    UserName: {
        type: String,
        required: true,
    },
    UserEmail: {
        type: String,
        required: true,
    },
    UserPass: {
        type: String,
        required: true,
    },
    UserRole: {
        type: String,
        enum: ["ADMIN", "DEV", "TEST", "GUEST"],
        required: true,
    },
    UserAbout: {
        type: String,
    }
});

module.exports = mongoose.model("User", UserSchema);