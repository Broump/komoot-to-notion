const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//importing all functions
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

const app = express();
app.use(cors());
app.use(express.json());

//endpoint to register a new user -> status "ok" or "error"
app.post("/api/register", async (req, res) => {
	username = req.body.username;
	email = req.body.email;
	password = req.body.password;

	const resregister = register.RegisterUser(username, email, password);

	res.json(await resregister);
});

//endpoint to login a user -> status "ok" or "error"
app.post("/api/login", async (req, res) => {
	email = req.body.email;
	password = req.body.password;

	const reslogin = login.LoginUser(email, password);

	res.json(await reslogin);
});

//endpoint to create a new process -> status "ok" or "error"
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

//endpoint to get all processes of a given user -> process data
app.get("/api/get-process", async (req, res) => {
	token = req.headers["accesstoken"];

	const resgetprocess = getprocess.GetProcess(token);

	res.json((await resgetprocess).data);
});

//endpoint to get user data from a given user -> user data
app.get("/api/get-user-data", async (req, res) => {
	token = req.headers["accesstoken"];

	const resgetuserdata = getuserdata.GetUserData(token);

	res.json((await resgetuserdata).data);
});

//endpoint to update a given user -> status "ok" or "error"
app.post("/api/update-user", async (req, res) => {
	token = req.body.accestoken;
	username = req.body.username;
	email = req.body.email;
	password = req.body.password;

	const resupdateuser = updateuser.UpdateUser(token, username, email, password);

	res.json(await resupdateuser);
});

//endpoint to start or stop a given process -> status "ok" or "error"
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

//endpoint to run all processs
app.post("/api/run-all-process", async (req, res) => {
	const resrunallprocess = runallprocess.RunAllProcess();

	res.json((await resrunallprocess).data);
});

//endpoint to delete a given process -> status "ok" or "error"
app.post("/api/delete-process", async (req, res) => {
	token = req.body.accestoken;
	processid = req.body.processid;

	const resdeleteprocess = deleteprocess.DeleteProcess(token, processid);

	res.json(await resdeleteprocess);
});

//endpoint to delete a given user -> status "ok" or "error"
app.post("/api/delete-user", async (req, res) => {
	token = req.body.accestoken;

	const resdeleteuser = deleteuser.DeleteUser(token);

	res.json(await resdeleteuser);
});

//starting the server, process.env.PORT == Heroku Port
app.listen(process.env.PORT || 3001, () => {
	console.log("Server is running on PORT 3001 or Heroku");
});
