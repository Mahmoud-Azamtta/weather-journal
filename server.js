// Setup empty JS object to act as endpoint for all routes
let projectData = [];

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Servers
const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is running on PORT: 3000");
});

// Get data route
const getData = async (req, res) => {
  res.status(200).send(projectData);
};

const postData = async (req, res) => {
  console.log(req.body);
  // projectData[req.body.date] = req.body;
  projectData.push(req.body);
  res.status(200).send({ message: "success" });
};

app.get("/all", getData);
app.post("/post", postData);
