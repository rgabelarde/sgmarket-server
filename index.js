var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var configData = require("./config/connection");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const listingRoutes = require("./routes/listingRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const suspiciousActivityLogRoutes = require("./routes/suspiciousActivityLogRoutes");

async function getApp() {
  var connectionInfo = await configData.getConnectionInfo();
  mongoose.connect(connectionInfo.DATABASE_URL);

  var app = express();

  var port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  console.log("app running on PORT: " + port);
  app.use("/api/user", userRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/listing", listingRoutes);
  app.use("/api/reservation", reservationRoutes);
  app.use("/api/report", suspiciousActivityLogRoutes);
  return app;
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

module.exports = { getApp };
