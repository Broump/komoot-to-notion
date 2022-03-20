const mongoose = require("mongoose");

const Process = new mongoose.Schema({
	processname: {
		type: String,
	},
	komootemail: {
		type: String,
	},
	komootid: {
		type: String,
	},
	komootpassword: {
		type: Object,
	},
	notion_database_id: {
		type: Object,
	},
	notion_api_token: {
		type: Object,
	},
	process_status: {
		type: String,
	},
});

const User = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		process: [Process],
	},
	{ collection: "user-data" }
);

const Usermodel = mongoose.model("UserData", User);

module.exports = Usermodel;
