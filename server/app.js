const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || require("./config/keys").PORT;
const db = require("./config/keys").MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
}).then( () => {
    console.log("Connected to database...");
}).catch( (err) => {
    console.log(err);
})

app.use("/api", require("./routes/routes"));

app.get("/", (req, res) => {
    res.send("Server is up and running."); 
});

app.listen(PORT, () => {
    console.log(`Server started, listening at port ${PORT}`);
});