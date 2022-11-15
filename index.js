const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import User Route
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

// Initialize express app
const app = express();

dotenv.config();

// Mongoose Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connect Successfull"))
  .catch((err) => {
    console.log(err);
  });

// APP triggers
app.use(express.json());
app.use("/api/auths", authRoute);
app.use("/api/users", userRoute);

app.use("*", (req, res) => {
  res.status(404).json({ errr: "Oops!!! Not Found." });
});

// Port listening handle
app.listen(process.env.PORT || 8000, () => {
  console.log("Backend Server is running");
});
