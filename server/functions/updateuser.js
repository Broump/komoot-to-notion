const User = require("../model/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.connect(process.env.CONNECTION);

async function UpdateUser(token, new_username, new_email, password) {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;

		const user = await User.findOne({
			email: email,
		});

		if (password.length > 0) {
			new_password = await bcrypt.hash(password, 10);
		} else {
			new_password = user.password;
		}

		const result = await User.findOneAndUpdate(
			{
				email: user.email,
			},
			{
				$set: {
					email: new_email,
					username: new_username,
					password: new_password,
				},
			}
		);

		return { status: "ok" };
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	UpdateUser,
};
