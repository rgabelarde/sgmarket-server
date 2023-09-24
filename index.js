require("dotenv").config();

const bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const listingRoutes = require("./routes/listingRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const suspiciousActivityLogRoutes = require("./routes/suspiciousActivityLogRoutes");

const PORT = process.env.PORT ?? 8080;
const app = express();

// config cookie-parser
app.use(cookieParser());

// config cors so that front-end can use
app.use(cors());
app.options((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, PATCH, POST, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
}, cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure bodyparser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
let mongoDB =
  process.env.ENV == "DEV"
    ? process.env.DB_LOCAL_URI
    : process.env.DATABASE_URL;

mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Added check for DB connection
if (!db) console.log("Error connecting db");
else console.log("Db connected successfully");

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
