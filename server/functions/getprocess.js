const User = require("../model/user");
const { encrypt, decrypt } = require("../helper/crypto.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.connect(process.env.CONNECTION);

async function GetProcess(token) {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;

		const user = await User.findOne({ email: email });

		return { status: "ok", data: user.process };
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	GetProcess,
};
