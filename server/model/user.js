const mongoose = require("mongoose");

const User = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		komootEmail: { type: String },
		komootPassword: { type: Array },
		komootID: { type: String },
		notion_api_token: { type: String },
		notion_database_id: { type: String },
	},
	{ collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
