const User = require("../model/user");
const { encrypt, decrypt } = require("../helper/crypto.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.connect(process.env.CONNECTION);

async function GetProcess(token) {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;

		const result = await User.find({ email: email }, function (err, user) {
			if (!err) {
				user.map((user) => {
					list_of_process = [];
					for (let index = 0; index < user.process.length; index++) {
						if (user.process.length > 0) {
							komootpassword = decrypt(user.process[index].komootpassword);
							notion_api_token = decrypt(user.process[index].notion_api_token);
							notion_database_id = decrypt(
								user.process[index].notion_database_id
							);

							list_of_process.push({
								processname: user.process[index].processname,
								komootemail: user.process[index].komootemail,
								komootid: user.process[index].komootid,
								komootpassword: komootpassword,
								notion_database_id: notion_database_id,
								notion_api_token: notion_api_token,
								process_status: user.process[index].process_status,
								processid: user.process[index]._id,
							});
						}
					}
				});
			} else {
			}
		})
			.clone()
			.catch(function (err) {
				console.log(err);
			});

		return { status: "ok", data: list_of_process };
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	GetProcess,
};
