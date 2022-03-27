import React from "react";
import {
	Button,
	Center,
	Text,
	Paper,
	Group,
	Image,
	Divider,
	Box,
} from "@mantine/core";
import { ArrowBack } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import komootdatabase from "../images/komoot-database.png";
import filterbike from "../images/filter-bike.png";
import filteryear from "../images/filter-year.png";
import filterrecorded from "../images/filter-recorded.png";

function DatabaseSettings() {
	const [submit, setSubmit] = useState(false);
	const navigate = useNavigate();
	return (
		<Center mt="xl">
			{submit ? (
				<Navigate to="/process" replace={true} />
			) : (
				<Box>
					<Center>
						<Button
							color="green"
							variant="filled"
							size="sm"
							leftIcon={<ArrowBack size={20} />}
							onClick={() => setSubmit(true)}
						>
							back to process
						</Button>
					</Center>
					<Group mt="md">
						<Paper shadow="xs" p="md">
							<Text>
								If you did everything correctly your database should look like
								this
							</Text>
							<Image
								width={800}
								fit="contain"
								src={komootdatabase}
								alt="notion tour database"
								mt="sm"
							/>
							<Text mt="sm">
								I deleted the startpoint for privacy. You can rearrange the
								properties as you like.
							</Text>
							<Divider mt="sm" />
							<Text mt="sm">
								You can set views for different sporttype. For example with this
								filter option only bike related tours are displayed
							</Text>
							<Image
								width={600}
								fit="contain"
								src={filterbike}
								alt="notion tour database"
								mt="sm"
							/>
							<Divider mt="sm" />
							<Text mt="sm">
								You can also set views for years. For that you need to filter
								tours that are between 01.01 and 31.12 in that year.
							</Text>
							<Image
								width={600}
								fit="contain"
								src={filteryear}
								alt="notion tour database"
								mt="sm"
							/>
							<Divider mt="sm" />
							<Text mt="sm">
								I also set up and filter for only showing tours i recorded
							</Text>
							<Image
								width={600}
								fit="contain"
								src={filterrecorded}
								alt="notion tour database"
								mt="sm"
							/>
						</Paper>
					</Group>
				</Box>
			)}{" "}
		</Center>
	);
}

export default DatabaseSettings;
