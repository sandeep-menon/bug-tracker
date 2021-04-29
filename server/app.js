const express = require("express");

const app = express();
const PORT = require("./config/keys").PORT;

app.get("/", (req, res) => {
    res.send("hello from server");
});

app.listen(PORT, () => {
    console.log(`Server started, listening at port ${PORT}`);
});