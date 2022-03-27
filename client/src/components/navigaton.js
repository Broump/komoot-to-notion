import React from "react";
import {
	Header,
	Box,
	Text,
	Menu,
	Divider,
	Modal,
	TextInput,
	PasswordInput,
	Button,
	Group,
} from "@mantine/core";
import axios from "axios";
import { EyeCheck, EyeOff, Check, X } from "tabler-icons-react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQuery } from "react-query";
import { Settings, Logout } from "tabler-icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "@mantine/notifications";

function Navigaton() {
	const [opened, setOpened] = useState(false);
	const notifications = useNotifications();

	const schema = z.object({
		username: z
			.string()
			.nonempty("Field is required")
			.min(2, { message: "Name should have at least 2 letters" }),
		email: z
			.string()
			.nonempty("Field is required")
			.email({ message: "Invalid email" }),
	});

	async function getUserData() {
		const res = await axios.get("http://localhost:3001/api/get-user-data", {
			headers: {
				accesstoken: localStorage.getItem("token"),
			},
		});
		return res.data;
	}

	const { data, status } = useQuery("userdata", getUserData);

	const form = useForm({
		schema: zodResolver(schema),
		initialValues: {
			username: "",
			password: "",
			email: "",
		},
	});

	if (status === "loading") {
		return <p>loading...</p>;
	}

	if (status === "error") {
		return <p>error!</p>;
	}

	function SetForm() {
		form.setValues({
			username: data.username,
			email: data.email,
		});
		setOpened(true);
	}

	async function UpdateUser() {
		try {
			const user = await axios.post("http://localhost:3001/api/update-user", {
				accestoken: localStorage.getItem("token"),
				username: form.values.username,
				email: form.values.email,
				password: form.values.password,
			});
			if (user) {
				if (user.data.status === "ok") {
					notifications.showNotification({
						title: "successfully changed user settings",
						message: "you need to log in again",
						color: "green",
						loading: false,
						icon: <Check />,
						disallowClose: true,
					});
					form.reset();
					handleLogout();
				} else {
					notifications.showNotification({
						title: "there was an error",
						message: "couldn't change user settings",
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

	async function deleteUser() {
		try {
			const user = await axios.post("http://localhost:3001/api/delete-user", {
				accestoken: localStorage.getItem("token"),
			});

			if (user.data.status === "ok") {
				notifications.showNotification({
					title: "successfully deleted user",
					color: "green",
					loading: false,
					icon: <Check />,
					disallowClose: true,
				});
				handleLogout();
				window.location.reload();
			} else {
				notifications.showNotification({
					title: "there was an error",
					message: "user couldn't be deleted",
					color: "red",
					loading: false,
					icon: <X />,
					disallowClose: true,
				});
			}
		} catch (err) {
			console.log(err);
		}
	}

	const handleLogout = () => {
		localStorage.removeItem("token");
		notifications.showNotification({
			title: "successfully logged out",
			color: "green",
			loading: false,
			icon: <Check />,
			disallowClose: true,
		});
		window.location.reload();
	};

	return (
		<Header height={40}>
			<Group position="apart" style={{ marginBottom: 5 }}>
				<Link as={Link} to="/" style={{ textDecoration: "none" }}>
					<Text
						weight={700}
						size="xl"
						variant="gradient"
						gradient={{ from: "lime", to: "inidgo", deg: 180 }}
					>
						KOMOOT-TO-NOTION
					</Text>
				</Link>

				<Group>
					<Box>
						{data.username ? (
							<Group position="apart">
								<Text size="xl">{data.username}</Text>
								<Menu trigger="hover" delay={500}>
									<Menu.Item
										icon={<Settings size={14} />}
										onClick={() => SetForm()}
									>
										Settings
									</Menu.Item>
									<Divider />
									<Menu.Item
										color="red"
										icon={<Logout size={14} />}
										onClick={() => handleLogout()}
									>
										Log Out
									</Menu.Item>
								</Menu>
							</Group>
						) : (
							<Box>
								<Text size="md">
									<Link
										to="/login"
										style={{
											textDecoration: "none",
											margin: "10px",
											color: "white",
										}}
									>
										login
									</Link>
									/
									<Link
										to="/register"
										style={{
											textDecoration: "none",
											margin: "10px",
											color: "white",
										}}
									>
										register
									</Link>
								</Text>
							</Box>
						)}
					</Box>
				</Group>
			</Group>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="update user settings"
			>
				<form onSubmit={form.onSubmit(UpdateUser)}>
					<TextInput
						placeholder="your username"
						label="new username"
						size="md"
						{...form.getInputProps("username")}
						mt="sm"
					/>
					<TextInput
						placeholder="example@mail.com"
						label="new email"
						size="md"
						{...form.getInputProps("email")}
						mt="sm"
					/>
					<PasswordInput
						placeholder="new password"
						icon={<LockClosedIcon />}
						label="new password"
						size="md"
						visibilityToggleIcon={({ reveal, size }) =>
							reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
						}
						{...form.getInputProps("password")}
						mt="sm"
					/>
					<Button variant="outline" color="lime" type="submit" mx="20" mt="sm">
						update user
					</Button>
				</form>
				<Button
					variant="outline"
					color="red"
					type="submit"
					mx="20"
					mt="sm"
					onClick={() => deleteUser()}
				>
					delete user
				</Button>
			</Modal>
		</Header>
	);
}

export default Navigaton;
