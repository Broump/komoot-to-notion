import React from "react";
import ProtectedRoute from "./components/protectedRoute";
import Register from "./components/register";
import Login from "./components/login";
import Process from "./components/process";
import Home from "./components/home";
import Navigaton from "./components/navigaton";
import DatabaseSettings from "./components/databaseSettings";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<Navigaton />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/databasesettings" element={<DatabaseSettings />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/process" element={<Process />} />
				</Route>
				<Route path="*" element={<div>404 Not Found!</div>} />
			</Routes>
		</QueryClientProvider>
	);
}

export default App;
