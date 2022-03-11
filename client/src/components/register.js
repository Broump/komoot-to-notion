import React from "react";
import { TextInput, PasswordInput, Button, Box } from "@mantine/core";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import axios from "axios";

function Register() {
	async function RegisterUser() {
		try {
			const user = await axios.post("http://localhost:3001/api/register", {
				username: form.values.username,
				email: form.values.email,
				password: form.values.password,
			});
			if (user) {
				console.log(user.status);
				if (user.status === 200) {
					form.reset();
				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	const schema = z.object({
		username: z
			.string()
			.nonempty("Field is required")
			.min(2, { message: "Name should have at least 2 letters" }),
		email: z
			.string()
			.nonempty("Field is required")
			.email({ message: "Invalid email" }),
		password: z
			.string()
			.nonempty("Field is required")
			.min(6, { message: "Password should have at least 6 letters" }),
	});

	const form = useForm({
		schema: zodResolver(schema),
		initialValues: {
			username: "",
			password: "",
			email: "",
		},
	});

	return (
		<Box sx={{ maxWidth: 400 }} mx="auto">
			<form onSubmit={form.onSubmit(RegisterUser)}>
				<TextInput
					placeholder="your username"
					label="username"
					size="md"
					required
					{...form.getInputProps("username")}
				/>
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
					register
				</Button>
			</form>
		</Box>
	);
}

export default Register;
