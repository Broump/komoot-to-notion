const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const axios = require("axios");
const { spawn } = require("child_process");
const register = require("./functions/register.js");
const login = require("./functions/login.js");

mongoose.connect(process.env.CONNECTION);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
	username = req.body.username;
	email = req.body.email;
	password = req.body.password;

	register.RegisterUser(username, email, password);

	res.json(register.RegisterUser);
});

app.post("/api/login", async (req, res) => {
	email = req.body.email;
	password = req.body.password;

	const reslogin = login.LoginUser(email, password);

	res.json((await reslogin).data);
});

app.listen(3001, () => {
	console.log("Server is running on PORT 3001");
});
