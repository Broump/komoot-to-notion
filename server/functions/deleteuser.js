const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/user");
mongoose.connect(process.env.CONNECTION);

async function DeleteUser(token) {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;

		const user = await User.deleteOne({
			email: email,
		});

		return { status: "ok" };
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	DeleteUser,
};
