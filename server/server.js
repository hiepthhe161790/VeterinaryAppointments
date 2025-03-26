const express = require("express");
require('dotenv').config();
const app = express();
const path = require("path");
const PORT = process.env.PORT;
const connectDB = require("./models/mongoConnection");
require("./models/mongoConnection");
const socketIo = require("socket.io");
const cors = require("cors");
const morgan = require('morgan');
const { doctorRouter } = require("./routes/DoctorRouter");
const { AppointmentRouter } = require("./routes/AppointmentRouter");

connectDB();

app.use(morgan());


// testing Socket.io
const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("a user connected");
});

// setup express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// setup routes
app.use("/register", require("./routes/confirmRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/api", require("./routes/petRoutes"));
app.use("/api", require("./routes/imageRoutes"));
app.use("/api", require("./routes/imgLocRoutes"));
app.use("/appointment", AppointmentRouter);
app.use("/doctor", doctorRouter);

// Remove serving React build files
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => console.log(`Listening at: http://localhost:${PORT}`));