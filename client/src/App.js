import React from "react";
import ProtectedRoute from "./components/protectedRoute";
import Register from "./components/register";
import Login from "./components/login";
import Process from "./components/process";
import Home from "./components/home";
import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/process" element={<Process />} />
			</Route>
			<Route path="*" element={<div>404 Not Found!</div>} />
		</Routes>
	);
}

export default App;
