const express = require("express");
const app = express(); // express package 
const db = require("./db");
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // req.body

const passport = require("./auth");
// just commit here
const PORT = process.env.PORT || 3000;  

//Middleware
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} Request made to: ${req.originalUrl}`);
    next();
}

//for implementing all routes
app.use(logRequest);

//app.get("/", logRequest, function (req, res) {
app.get("/", function (req, res) {
    res.send("welcome to our Hotel..");
});

//app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', { session: false });

app.get("/", function (req, res) {
    res.send("welcome to my hotel, how can i help you..., we have list of menus");
});

const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuRoutes");

app.use("/menu", menuRoutes);
//app.use("/person", localAuthMiddleware, personRoutes);
app.use("/person", personRoutes);

app.listen(3000, () => console.log("Server is listening on port 3000"));


