const User = require("../model/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION);

async function RegisterUser(username, email, password) {
	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({
			username: username,
			email: email,
			password: hashedPassword,
		});
		return { status: "ok" };
	} catch (err) {
		console.log(err);
		return { status: "error", error: "Duplicate email" };
	}
}

module.exports = {
	RegisterUser,
};
