const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/user");
mongoose.connect(process.env.CONNECTION);

async function DeleteProcess(token, processid) {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;

		const user = await User.findOne({
			email: email,
		});

		const result = await User.findOneAndUpdate(
			{
				email: user.email,
			},
			{ $pull: { process: { _id: processid } } }
		);

		return { status: "ok" };
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	DeleteProcess,
};
