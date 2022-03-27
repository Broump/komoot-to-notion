import React from "react";
import { TextInput, PasswordInput, Button, Box } from "@mantine/core";
import { EyeCheck, EyeOff, Check, X } from "tabler-icons-react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useNotifications } from "@mantine/notifications";

function Register() {
	const [submit, setSubmit] = useState(false);
	const notifications = useNotifications();
	async function RegisterUser() {
		try {
			const user = await axios.post("http://localhost:3001/api/register", {
				username: form.values.username,
				email: form.values.email,
				password: form.values.password,
			});
			if (user) {
				if (user.data.status === "ok") {
					notifications.showNotification({
						title: "successfully registerd",
						message: "your are now redirected to the login page",
						color: "green",
						loading: false,
						icon: <Check />,
						disallowClose: true,
					});
					form.reset();
					setSubmit(true);
				} else {
					notifications.showNotification({
						title: "there was an error",
						message: "username or email are already in use",
						color: "red",
						loading: false,
						icon: <X />,
						disallowClose: true,
					});
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
			{submit ? (
				<Navigate to="/login" replace={true} />
			) : (
				<form onSubmit={form.onSubmit(RegisterUser)}>
					<TextInput
						placeholder="your username"
						label="username"
						size="md"
						required
						mt="sm"
						{...form.getInputProps("username")}
					/>
					<TextInput
						placeholder="example@mail.com"
						label="email"
						size="md"
						required
						mt="sm"
						{...form.getInputProps("email")}
					/>
					<PasswordInput
						placeholder="password"
						icon={<LockClosedIcon />}
						label="password"
						size="md"
						required
						mt="sm"
						visibilityToggleIcon={({ reveal, size }) =>
							reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
						}
						{...form.getInputProps("password")}
					/>
					<Button variant="outline" color="lime" type="submit" mx="20" mt="sm">
						register
					</Button>
				</form>
			)}
		</Box>
	);
}

export default Register;
