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
} from "@mantine/core";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "react-query";

function Process() {
	const [openedModal, setOpenedModal] = useState(false);
	const [openedKomootID, setOpenedKomootID] = useState(false);
	const [openedDatabaseID, setOpenedDatabaseID] = useState(false);
	const [openedApiToken, setOpenedApiToken] = useState(false);

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
				if (process.status === 200) {
					form.reset();
					setOpenedModal(false);
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
			getProcess();
		} catch (err) {
			console.log(err);
		}
	}

	const { data, status } = useQuery("process", getProcess);

	if (status === "loading") {
		return <p>loading...</p>;
	}

	if (status === "error") {
		return <p>error!</p>;
	}

	return (
		<Box sx={{ maxWidth: 1500 }} mx="auto">
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
					onClick={() => setOpenedModal(true)}
				>
					<div>
						<PlusCircledIcon />
					</div>
				</Button>
			</Tooltip>

			{data.map((process) => (
				<Card shadow="sm" p="lg">
					<Group position="apart" style={{ marginBottom: 5 }}>
						<Text weight={500}>{process.processname}</Text>
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
					{process.process_status === "stopped" ? (
						<Button
							variant="light"
							color="green"
							fullWidth
							style={{ marginTop: 14 }}
							onClick={() => startStopProcess(process._id, "started")}
						>
							start process
						</Button>
					) : (
						<Button
							variant="light"
							color="red"
							fullWidth
							style={{ marginTop: 14 }}
							onClick={() => startStopProcess(process._id, "stopped")}
						>
							stop process
						</Button>
					)}
				</Card>
			))}

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
						{...form.getInputProps("processname")}
					/>
					<TextInput
						placeholder="example@mail.com"
						label="komoot email"
						size="md"
						required
						{...form.getInputProps("komootemail")}
					/>
					<NumberInput
						placeholder="75982795827"
						label="komoot id"
						size="md"
						required
						hideControls
						{...form.getInputProps("komootid")}
					/>
					<PasswordInput
						placeholder="komoot password"
						icon={<LockClosedIcon />}
						label="komoot password"
						size="md"
						required
						visibilityToggleIcon={({ reveal, size }) =>
							reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
						}
						{...form.getInputProps("komootpassword")}
					/>
					<TextInput
						placeholder="notion database id"
						label="notion database id"
						size="md"
						required
						{...form.getInputProps("notion_database_id")}
					/>
					<TextInput
						placeholder="notion api token"
						label="notion api token"
						size="md"
						required
						{...form.getInputProps("notion_api_token")}
					/>
					<Button variant="outline" color="lime" type="submit" mx="20">
						create process
					</Button>
				</form>

				<Popover
					opened={openedKomootID}
					onClose={() => setOpenedKomootID(false)}
					target={
						<Button
							color="green"
							compact
							onClick={() => setOpenedKomootID(true)}
						>
							how to get Komootid
						</Button>
					}
					width={400}
					position="right"
					withArrow
				>
					<Text size="">This is how you get your Komootid</Text>
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

				<Popover
					opened={openedDatabaseID}
					onClose={() => setOpenedDatabaseID(false)}
					target={
						<Button
							color="green"
							compact
							onClick={() => setOpenedDatabaseID(true)}
						>
							how to get databaseid
						</Button>
					}
					width={260}
					position="right"
					withArrow
				>
					<Text size="sm">This is how you get your Komootid</Text>
				</Popover>

				<Popover
					opened={openedApiToken}
					onClose={() => setOpenedApiToken(false)}
					target={
						<Button
							color="green"
							compact
							onClick={() => setOpenedApiToken(true)}
						>
							how to get apitoken
						</Button>
					}
					width={260}
					position="right"
					withArrow
				>
					<Text size="sm">This is how you get your Komootid</Text>
				</Popover>
			</Modal>
		</Box>
	);
}

export default Process;
