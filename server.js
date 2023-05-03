const express = require("express");
var morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// create express app
const app = express();

app.use(morgan("combined")); //logger

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to server application." });
});

require("./src/routes/userManagement.routes.js")(app);
require("./src/routes/settings.routes.js")(app);
require("./src/routes/reports.routes.js")(app);
// set port, listen for requests
app.listen(5000, () => {
  console.log("Server is running on port 5000.");
});
