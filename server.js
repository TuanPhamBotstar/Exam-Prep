const express = require("express");
const bodyParser = require("body-parser");

const app = new express();
const port = 8082;

const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const url = "mongodb://localhost:27017/examprep";

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended:true,
    })
);

const cors = require("cors");

const userRoutes = require("./app/routes/user.route");

mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology:true});

mongoose.connection
    .once("open",() => console.log("Connected"))
    .on("error",(error) => {
        console.log("Error: ", error)
    })
app.use(cors());

app.use("/api/users", userRoutes);

app.get("/", (req,res) => { 
    res.send("Welcome to PTExamPrep")
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});