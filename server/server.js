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
const newprocess = require("./functions/newprocess.js");
const getprocess = require("./functions/getprocess");
const startstopprocess = require("./functions/startstopprocess");
const runallprocess = require("./functions/runallprocess");
const getuserdata = require("./functions/getuserdata");
const updateuser = require("./functions/updateuser");
const deleteprocess = require("./functions/deleteprocess");
const deleteuser = require("./functions/deleteuser");

mongoose.connect(process.env.CONNECTION);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
	username = req.body.username;
	email = req.body.email;
	password = req.body.password;

	const resregister = register.RegisterUser(username, email, password);

	res.json(await resregister);
});

app.post("/api/login", async (req, res) => {
	email = req.body.email;
	password = req.body.password;

	const reslogin = login.LoginUser(email, password);

	res.json(await reslogin);
});

app.post("/api/new-process", async (req, res) => {
	token = req.body.accestoken;
	processname = req.body.processname;
	komootemail = req.body.komootemail;
	komootid = req.body.komootid;
	komootpassword = req.body.komootpassword;
	notion_database_id = req.body.notion_database_id;
	notion_api_token = req.body.notion_api_token;
	process_status = "stopped";

	const resnewprocess = newprocess.NewProcess(
		token,
		processname,
		komootemail,
		komootid,
		komootpassword,
		notion_database_id,
		notion_api_token,
		process_status
	);

	res.json(await resnewprocess);
});

app.get("/api/get-process", async (req, res) => {
	token = req.headers["accesstoken"];

	const resgetprocess = getprocess.GetProcess(token);

	res.json((await resgetprocess).data);
});

app.get("/api/get-user-data", async (req, res) => {
	token = req.headers["accesstoken"];

	const resgetuserdata = getuserdata.GetUserData(token);

	res.json((await resgetuserdata).data);
});

app.post("/api/update-user", async (req, res) => {
	token = req.body.accestoken;
	username = req.body.username;
	email = req.body.email;
	password = req.body.password;

	const resupdateuser = updateuser.UpdateUser(token, username, email, password);

	res.json(await resupdateuser);
});

app.post("/api/startstop-process", async (req, res) => {
	token = req.body.accestoken;
	processid = req.body.processid;
	process_status = req.body.process_status;

	const resstartstopprocess = startstopprocess.StartStopProcess(
		token,
		processid,
		process_status
	);

	res.json(await resstartstopprocess);
});

app.post("/api/run-all-process", async (req, res) => {
	const resrunallprocess = runallprocess.RunAllProcess();

	res.json((await resrunallprocess).data);
});

app.post("/api/delete-process", async (req, res) => {
	token = req.body.accestoken;
	processid = req.body.processid;

	const resdeleteprocess = deleteprocess.DeleteProcess(token, processid);

	res.json(await resdeleteprocess);
});

app.post("/api/delete-user", async (req, res) => {
	token = req.body.accestoken;

	const resdeleteuser = deleteuser.DeleteUser(token);

	res.json(await resdeleteuser);
});

app.listen(3001, () => {
	console.log("Server is running on PORT 3001");
});
