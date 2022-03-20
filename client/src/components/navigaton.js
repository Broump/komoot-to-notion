import React from "react";
import { Header, Box, Text } from "@mantine/core";
import axios from "axios";

function Navigaton() {
	return (
		<Header height={50} p="md">
			<Text
				weight={700}
				size="md"
				variant="gradient"
				gradient={{ from: "lime", to: "inidgo", deg: 180 }}
			>
				KOMOOT-TO-NOTION
			</Text>
		</Header>
	);
}

export default Navigaton;
