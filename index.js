const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const kanbanRoutes = require("./server/routes/users.routes");
const { authorize } = require("./server/middlewares/auth");
const usersRoutes = require("./server/routes/users.routes");
const projectsRoutes = require("./server/routes/projects.routes");
const featuresRoutes = require("./server/routes/features.routes");
const storiesRoutes = require("./server/routes/stories.routes");
const tasksRoutes = require("./server/routes/tasks.routes");

const app = express();

const { NODE_ENV, PORT, DATABASE_URL, CLIENT_URL } = process.env;

const isDevelopment = NODE_ENV === "development";
const ACITVE_PORT = PORT || 8000;

if (isDevelopment) {
	app.use(morgan("dev"));
} else {
	app.use(morgan("combined"));
}

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

if (isDevelopment) {
	app.use(cors());
} else {
	app.use(cors({ origin: CLIENT_URL, optionsSuccessStatus: 200 }));
}

app.use("/api", kanbanRoutes);
app.use("/api/v1/users", authorize, usersRoutes);
app.use("/api/v1/projects", authorize, projectsRoutes);
app.use("/api/v1/features", authorize, featuresRoutes);
app.use("/api/v1/stories", authorize, storiesRoutes);
app.use("/api/v1/tasks", authorize, tasksRoutes);

if (NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));

	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}

mongoose
	.connect(DATABASE_URL, {
		useCreateIndex: true,
		useFindAndModify: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(ACITVE_PORT, () => {
			console.log(`DB Connected and the server is running at PORT ${PORT}`);
		});
	})
	.catch(err => {
		console.error("DB Connection Failed", err);
	});
