const User = require("../model/user");
const { encrypt } = require("../helper/crypto.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.connect(process.env.CONNECTION);

async function NewProcess(
	token,
	processname,
	komootemail,
	komootid,
	komootpassword,
	notion_database_id,
	notion_api_token
) {
	try {
		const encryptedkomootpassword = await encrypt(komootpassword);
		const encryptednotion_database_id = await encrypt(notion_database_id);
		const encryptednotion_api_token = await encrypt(notion_api_token);

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const email = decoded.email;
		const user = await User.findOne({ email: email });

		const addprocess = await User.findOneAndUpdate(
			{ email: user.email },
			{
				$push: {
					process: {
						processname: processname,
						komootemail: komootemail,
						komootid: komootid,
						komootpassword: encryptedkomootpassword,
						notion_database_id: encryptednotion_database_id,
						notion_api_token: encryptednotion_api_token,
						process_status: "stopped",
					},
				},
			}
		);
		return { status: "ok" };
	} catch (err) {
		return { status: "error" };
	}
}

module.exports = {
	NewProcess,
};
