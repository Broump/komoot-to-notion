const User = require("../model/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.connect(process.env.CONNECTION);

async function LoginUser(email, password) {
	try {
		const user = await User.findOne({
			email: email,
		});

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (isPasswordValid) {
			const token = jwt.sign(
				{
					username: user.username,
					email: user.email,
				},
				process.env.ACCESS_TOKEN_SECRET
			);
			return { status: "ok", data: token };
		} else {
			return { status: "error" };
		}
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	LoginUser,
};
