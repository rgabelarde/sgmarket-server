require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const listingRoutes = require("./routes/listingRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const suspiciousActivityLogRoutes = require("./routes/suspiciousActivityLogRoutes");

const mongoURL = process.env.DATABASE_URL;
const PORT = process.env.PORT ?? 3000;

mongoose.connect(mongoURL);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/report", suspiciousActivityLogRoutes);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

module.exports = app;
