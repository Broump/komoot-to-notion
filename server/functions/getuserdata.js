const User = require("../model/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.connect(process.env.CONNECTION);

async function GetUserData(token) {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;

		const user = await User.findOne({ email: email });

		return { status: "ok", data: user };
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	GetUserData,
};
