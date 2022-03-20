const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("../helper/crypto.js");
mongoose.connect(process.env.CONNECTION);
const User = require("../model/user");
const { spawn } = require("child_process");

async function RunAllProcess() {
	try {
		const result = await User.find({}, function (err, user) {
			if (!err) {
				user.map((user) => {
					for (let index = 0; index < user.process.length; index++) {
						if (user.process.length > 0) {
							komootpassword = decrypt(user.process[index].komootpassword);
							notion_api_token = decrypt(user.process[index].notion_api_token);
							notion_database_id = decrypt(
								user.process[index].notion_database_id
							);

							const childPython = spawn("python3", [
								"komootToNotion.py",
								user.process[index].komootid,
								user.process[index].komootemail,
								komootpassword,
								notion_api_token,
								notion_database_id,
							]);

							childPython.stdout.on("data", (data) => {
								console.log(data.toString("utf8"));
							});
						}
					}
				});
			} else {
				throw err;
			}
		})
			.clone()
			.catch(function (err) {
				console.log(err);
			});

		return { status: "ok" };
	} catch (err) {
		console.log(err);
		return { status: "error" };
	}
}

module.exports = {
	RunAllProcess,
};
