import React from "react";
import { TextInput, PasswordInput, Button, Box } from "@mantine/core";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useForm } from "@mantine/form";
import axios from "axios";

function Login() {
	async function LoginUser() {
		try {
			const user = await axios.post("http://localhost:3001/api/login", {
				email: form.values.email,
				password: form.values.password,
			});
			if (user) {
				console.log(user);
				if (user.status === 200) {
					localStorage.setItem("token", user.data);
					form.reset();
				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	const form = useForm({
		initialValues: {
			password: "",
			email: "",
		},
	});

	return (
		<Box sx={{ maxWidth: 400 }} mx="auto">
			<form onSubmit={form.onSubmit(LoginUser)}>
				<TextInput
					placeholder="example@mail.com"
					label="email"
					size="md"
					required
					{...form.getInputProps("email")}
				/>
				<PasswordInput
					placeholder="password"
					icon={<LockClosedIcon />}
					label="password"
					size="md"
					required
					visibilityToggleIcon={({ reveal, size }) =>
						reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
					}
					{...form.getInputProps("password")}
				/>
				<Button variant="outline" color="lime" type="submit" mx="20">
					login
				</Button>
			</form>
		</Box>
	);
}

export default Login;
