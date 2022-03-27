import React from "react";
import { Box, Button, Center, Timeline, Text } from "@mantine/core";
import {
	ArrowUpRightCircle,
	UserCircle,
	LayoutGridAdd,
	Prompt,
	Database,
} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function Home() {
	const [submit, setSubmit] = useState(false);
	const navigate = useNavigate();

	return (
		<Center mt="xl">
			<Box sx={{ maxWidth: 800 }} mx="auto">
				{submit ? (
					<Navigate to="/process" replace={true} />
				) : (
					<Button
						color="green"
						variant="filled"
						size="xl"
						leftIcon={<ArrowUpRightCircle size={30} />}
						onClick={() => setSubmit(true)}
					>
						Get Started
					</Button>
				)}
			</Box>
		</Center>
	);
}

export default Home;
