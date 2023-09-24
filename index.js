require("dotenv").config();

var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const listingRoutes = require("./routes/listingRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const suspiciousActivityLogRoutes = require("./routes/suspiciousActivityLogRoutes");

const mongoURL = process.env.DATABASE_URL || process.env.MONGO_URI;
const PORT = process.env.PORT ?? 8080;

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

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
