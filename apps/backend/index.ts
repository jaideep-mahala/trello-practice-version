import express from "express";
import { prisma } from "db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
	const { username, email, password } = req.body as {
		username?: string;
		email?: string;
		password?: string;
	};

	if (!username || !email || !password) {
		res.status(400).json({ error: "username, email, and password are required" });
		return;
	}

	try {
		const user = await prisma.user.create({
			data: { username, email, password },
		});

		console.log(`User signed up: ${user.email}`);
		res.status(201).json({ message: "User signed up", userId: user.id });
	} catch (error) {
		console.error("Signup failed", error);
		res.status(500).json({ error: "Could not sign up user" });
	}
});

app.listen(4000, () => {
	console.log("Backend running at http://localhost:4000");
});