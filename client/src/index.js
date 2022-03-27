import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
			<NotificationsProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
