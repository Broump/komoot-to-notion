const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/user");
mongoose.connect(process.env.CONNECTION);
const runallprocess = require("../functions/runallprocess");

async function StartStopProcess(token, processid, process_status) {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;

		const user = await User.findOne({
			email: email,
		});

		const result = await User.findOneAndUpdate(
			{
				"process._id": processid,
			},
			{
				$set: {
					"process.$.process_status": process_status,
				},
			}
		);

		if (process_status === "started") {
			runallprocess.RunAllProcess();
		}

		return { status: "ok" };
	} catch (err) {
		console.log(err);
		return { status: "error" };
	}
}

module.exports = {
	StartStopProcess,
};
