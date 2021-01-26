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

const subjectRoutes = require("./app/routes/subject.route");
const userRoutes = require("./app/routes/user.route");
const questionRoutes = require("./app/routes/question.route");
const testRoutes = require("./app/routes/test.route");
mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology:true});

mongoose.connection
    .once("open",() => console.log("Connected"))
    .on("error",(error) => {
        console.log("Error: ", error)
    })
app.use(cors());

app.use("/api/admin/subjects", subjectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/questions", questionRoutes);
app.use("/api/admin/tests", testRoutes);

app.get("/", (req,res) => { 
    res.send("Welcome to PTExamPrep")
});
app.get('/api/subjects', subjectRoutes)

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});