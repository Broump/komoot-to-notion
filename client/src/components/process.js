import React from "react";
import {
	TextInput,
	PasswordInput,
	Button,
	Box,
	Text,
	Modal,
	Tooltip,
	NumberInput,
	Popover,
	Mark,
	List,
	Card,
	Badge,
	Group,
	ActionIcon,
	Skeleton,
	Divider,
	Center,
} from "@mantine/core";
import {
	EyeCheck,
	EyeOff,
	Trash,
	QuestionMark,
	X,
	Check,
	Settings,
} from "tabler-icons-react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { Navigate } from "react-router-dom";

function Process() {
	const [openedModal, setOpenedModal] = useState(false);
	const [openedKomootID, setOpenedKomootID] = useState(false);
	const [openedDatabaseID, setOpenedDatabaseID] = useState(false);
	const [openedApiToken, setOpenedApiToken] = useState(false);
	const [submit, setSubmit] = useState(false);

	const notifications = useNotifications();

	const form = useForm({
		initialValues: {
			processname: "",
			komootemail: "",
			komootid: "",
			komootpassword: "",
			notion_database_id: "",
			notion_api_token: "",
		},
	});

	async function CreateProcess() {
		try {
			const process = await axios.post(
				"http://localhost:3001/api/new-process",
				{
					accestoken: localStorage.getItem("token"),
					processname: form.values.processname,
					komootemail: form.values.komootemail,
					komootid: form.values.komootid,
					komootpassword: form.values.komootpassword,
					notion_database_id: form.values.notion_database_id,
					notion_api_token: form.values.notion_api_token,
				}
			);
			if (process) {
				if (process.data.status === "ok") {
					notifications.showNotification({
						title: "successfully created process",
						message: "you can now start your process",
						color: "green",
						loading: false,
						icon: <Check />,
						disallowClose: true,
					});
					form.reset();
					setOpenedModal(false);
				} else {
					notifications.showNotification({
						title: "there was an error",
						message: "process couldn't be created",
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

	async function getProcess() {
		const res = await axios.get("http://localhost:3001/api/get-process", {
			headers: {
				accesstoken: localStorage.getItem("token"),
			},
		});
		return res.data;
	}

	async function startStopProcess(processid, process_status) {
		try {
			const process = await axios.post(
				"http://localhost:3001/api/startstop-process",
				{
					accestoken: localStorage.getItem("token"),
					processid: processid,
					process_status: process_status,
				}
			);

			if (process) {
				if (process.data.status === "ok" && process_status === "started") {
					notifications.showNotification({
						title: "successfully started process",
						message: "you can now see changes in your notion database",
						color: "green",
						loading: false,
						icon: <Check />,
						disallowClose: true,
					});
					window.location.reload();
				} else if (
					process.data.status === "error" &&
					process_status === "started"
				) {
					notifications.showNotification({
						title: "there was an error",
						message: "process couldn't be started",
						color: "red",
						loading: false,
						icon: <X />,
						disallowClose: true,
					});
				} else if (
					process.data.status === "ok" &&
					process_status === "stopped"
				) {
					notifications.showNotification({
						title: "successfully stopped process",
						message: "you're process is now stopped",
						color: "green",
						loading: false,
						icon: <Check />,
						disallowClose: true,
					});
					window.location.reload();
				} else if (
					process.data.status === "error" &&
					process_status === "stopped"
				) {
					notifications.showNotification({
						title: "there was an error",
						message: "process couldn't be stopped",
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

	async function deleteProcess(processid) {
		try {
			const process = await axios.post(
				"http://localhost:3001/api/delete-process",
				{
					accestoken: localStorage.getItem("token"),
					processid: processid,
				}
			);

			if (process.data.status === "ok") {
				notifications.showNotification({
					title: "successfully deleted process",
					color: "green",
					loading: false,
					icon: <Check />,
					disallowClose: true,
				});
				window.location.reload();
			} else {
				notifications.showNotification({
					title: "there was an error",
					message: "process couldn't be deleted",
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

	const { data, status } = useQuery("process", getProcess);

	if (status === "loading") {
		return (
			<Box sx={{ maxWidth: 500 }} mx="auto">
				<Skeleton height={8} radius="xl" />
				<Skeleton height={8} mt={6} radius="xl" />
				<Skeleton height={8} mt={6} width="70%" radius="xl" />
			</Box>
		);
	}

	if (status === "error") {
		return <p>error!</p>;
	}

	console.log(data);

	if (data) {
		return (
			<Box sx={{ maxWidth: 500 }} mx="auto">
				{submit ? (
					<Navigate to="/databasesettings" replace={true} />
				) : (
					<Box>
						<Tooltip
							label="create new process"
							color="lime"
							radius="xs"
							withArrow
							transition="fade"
							transitionDuration={500}
						>
							<Button
								variant="outline"
								color="green"
								radius="xs"
								size="md"
								mt="sm"
								onClick={() => setOpenedModal(true)}
							>
								<div>
									<PlusCircledIcon />
								</div>
							</Button>
						</Tooltip>

						<Box>
							{data.map((process) => (
								<Card shadow="sm" p="lg" mt="sm">
									<Group position="apart" style={{ marginBottom: 5 }}>
										<Text weight={800}>{process.processname}</Text>
										{process.process_status === "stopped" ? (
											<Badge color="red" variant="light">
												{process.process_status}
											</Badge>
										) : (
											<Badge color="green" variant="light">
												{process.process_status}
											</Badge>
										)}
									</Group>
									<Group position="apart" style={{ marginBottom: 5 }}>
										{process.process_status === "stopped" ? (
											<Button
												variant="light"
												color="green"
												size="md"
												style={{ marginTop: 14 }}
												mt="sm"
												onClick={() =>
													startStopProcess(process.processid, "started")
												}
											>
												start process
											</Button>
										) : (
											<Button
												variant="light"
												color="red"
												size="md"
												style={{ marginTop: 14 }}
												mt="sm"
												onClick={() =>
													startStopProcess(process.processid, "stopped")
												}
											>
												stop process
											</Button>
										)}
										<ActionIcon>
											<Trash
												size={20}
												color="red"
												onClick={() => deleteProcess(process.processid)}
											/>
										</ActionIcon>
									</Group>
								</Card>
							))}
						</Box>

						<Modal
							opened={openedModal}
							centered
							onClose={() => setOpenedModal(false)}
							title="enter your values!"
						>
							<form onSubmit={form.onSubmit(CreateProcess)}>
								<TextInput
									placeholder="process 1"
									label="process name"
									size="md"
									required
									mt="sm"
									{...form.getInputProps("processname")}
								/>
								<TextInput
									placeholder="example@mail.com"
									label="komoot email"
									size="md"
									required
									mt="sm"
									{...form.getInputProps("komootemail")}
								/>
								<Group position="apart">
									<NumberInput
										placeholder="75982795827"
										label="komoot id"
										size="md"
										required
										hideControls
										mt="sm"
										{...form.getInputProps("komootid")}
									/>
									<Popover
										opened={openedKomootID}
										onClose={() => setOpenedKomootID(false)}
										target={
											<ActionIcon variant="filled" mt={25}>
												<QuestionMark
													size={14}
													onClick={() => setOpenedKomootID(true)}
												/>
											</ActionIcon>
										}
										width={500}
										heigth={300}
										position="right"
										withArrow
										mt="sm"
									>
										<Text size="">This is how you get your Komootid:</Text>
										<List type="ordered">
											<List.Item>
												go to https://www.komoot.com and log into your account
											</List.Item>
											<List.Item>go to your profile</List.Item>
											<List.Item>
												copy your ID from the URLhttps://www.komoot.de/user/
												<Mark>578265286</Mark>
											</List.Item>
										</List>
									</Popover>
								</Group>
								<PasswordInput
									placeholder="komoot password"
									icon={<LockClosedIcon />}
									label="komoot password"
									size="md"
									mt="sm"
									required
									visibilityToggleIcon={({ reveal, size }) =>
										reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
									}
									{...form.getInputProps("komootpassword")}
								/>
								<Group position="apart">
									<TextInput
										placeholder="notion api token"
										label="notion api token"
										size="md"
										required
										{...form.getInputProps("notion_api_token")}
										mt="sm"
									/>
									<Popover
										opened={openedApiToken}
										onClose={() => setOpenedApiToken(false)}
										target={
											<ActionIcon variant="filled" mt={25}>
												<QuestionMark
													size={14}
													onClick={() => setOpenedApiToken(true)}
												/>
											</ActionIcon>
										}
										width={260}
										position="right"
										withArrow
										mt="sm"
									>
										<Text size="">this is how you get your api token:</Text>
										<List type="ordered">
											<List.Item>
												Sign up in your notion account in your browser
											</List.Item>
											<List.Item>
												Go to{" "}
												<Text
													variant="link"
													component="a"
													href="https://www.notion.so/my-integrations"
												>
													my integrations
												</Text>{" "}
												and create a new integration
											</List.Item>
											<List.Item>copy the internal integration token</List.Item>
										</List>
									</Popover>
								</Group>
								<Group position="apart">
									<TextInput
										placeholder="notion database id"
										label="notion database id"
										size="md"
										mt="sm"
										required
										{...form.getInputProps("notion_database_id")}
									/>
									<Popover
										opened={openedDatabaseID}
										onClose={() => setOpenedDatabaseID(false)}
										target={
											<ActionIcon variant="filled" mt={25}>
												<QuestionMark
													size={14}
													onClick={() => setOpenedDatabaseID(true)}
												/>
											</ActionIcon>
										}
										width={300}
										mt="sm"
										position="right"
										withArrow
									>
										<Text size="">this is how you get your database id:</Text>
										<List type="ordered">
											<List.Item>
												Head over to the notion database which you want to add
												the komoot data to
											</List.Item>
											<List.Item>
												copy the databaseID to the script: it should look like:{" "}
												notion.so/<Mark>databaseID</Mark>
												?v=05ec34ed86cf48909d9e38f2e75af478
											</List.Item>
											<List.Item>
												Share your database to the integration
											</List.Item>
										</List>
										<Divider my="sm" />
										<Text color="red">
											It is IMPORTANT that your databse looks like the following
										</Text>
										<List>
											<List.Item>title: tourname</List.Item>
											<List.Item>date: date</List.Item>
											<List.Item>distance: number</List.Item>
											<List.Item>sporttype: select</List.Item>
											<List.Item>startpoint: select</List.Item>
											<List.Item>duration: number</List.Item>
											<List.Item>elevationdown: number</List.Item>
											<List.Item>elevationup: number</List.Item>
											<List.Item>tourid: number</List.Item>
											<List.Item>tourtype: select</List.Item>
											<List.Item>toururl: url</List.Item>
										</List>
									</Popover>
								</Group>

								<Button
									variant="outline"
									color="lime"
									type="submit"
									mx="20"
									mt="sm"
								>
									create process
								</Button>
							</form>
						</Modal>
						<Center>
							<Button
								color="green"
								variant="filled"
								size="sm"
								mt="md"
								leftIcon={<Settings size={20} />}
								onClick={() => setSubmit(true)}
							>
								databse settings
							</Button>
						</Center>
					</Box>
				)}
			</Box>
		);
	}
}

export default Process;
