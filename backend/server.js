const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cookieParser = require('cookie-parser');

connectDB();
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173", "https://to-do-app-frontend-dun.vercel.app"
  ],
  "Access-Control-Allow-Origin": ["https://to-do-app-frontend-dun.vercel.app","https://to-do-app-backend-mfp7.onrender.com"],
  "Access-Control-Allow-Credentials": true,
  methods: "GET,POST,PUT,DELETE,PATCH",
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization","set-cookie"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Ensure your app handles preflight requests
app.options('*', cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200).send({ message: "welcome to the todo - app - api!" });
});

app.use(authRoutes);
app.use(taskRoutes); // Ensure that the task routes can be accessed

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
