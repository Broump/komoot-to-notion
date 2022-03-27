import React from "react";
import { TextInput, PasswordInput, Button, Box } from "@mantine/core";
import { EyeCheck, EyeOff, Check, X } from "tabler-icons-react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useForm } from "@mantine/form";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNotifications } from "@mantine/notifications";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function Login() {
	const [submit, setSubmit] = useState(false);
	const notifications = useNotifications();
	async function LoginUser() {
		try {
			const user = await axios.post(
				"https://komoot-to-notion.herokuapp.com/api/login",
				{
					email: form.values.email,
					password: form.values.password,
				}
			);
			if (user) {
				if (user.data.status === "ok") {
					notifications.showNotification({
						title: "successfully logged in",
						message: "your are now logged in",
						color: "green",
						loading: false,
						icon: <Check />,
						disallowClose: true,
					});
					localStorage.setItem("token", user.data.data);
					form.reset();
					setSubmit(true);
				} else {
					notifications.showNotification({
						title: "there was an error",
						message: "wrong email or password",
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

	const form = useForm({
		initialValues: {
			password: "",
			email: "",
		},
	});

	return (
		<Box sx={{ maxWidth: 400 }} mx="auto">
			{submit ? (
				<Navigate to="/process" replace={true} />
			) : (
				<div>
					<form onSubmit={form.onSubmit(LoginUser)}>
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
							visibilityToggleIcon={({ reveal, size }) =>
								reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
							}
							{...form.getInputProps("password")}
							mt="sm"
						/>
						<Button
							variant="outline"
							color="lime"
							type="submit"
							mx="20"
							mt="sm"
							mb="sm"
						>
							login
						</Button>
					</form>
					<Link
						to="/register"
						style={{
							textDecoration: "none",
							color: "white",
						}}
					>
						no account?
					</Link>
				</div>
			)}
		</Box>
	);
}

export default Login;
