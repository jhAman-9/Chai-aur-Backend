const express = require("express");
const app = express();

const db = require("./db");

// middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());


app.get("/", function (req, res) {
  res.send("Welcome to my hotel");
});

// Import routes from router
const person = require('./routers/person.router.js')
const menuItems = require('./routers/menuItem.router.js')

// routing of /person and /menuitem
app.use("/person", person);
app.use("/menu", menuItems);


app.listen(process.env.PORT || 3000, () => {
  console.log("listen on port 3000");
});
