const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const dbConnection = require("./db");

const userRoute = require("./routes/userroute");
const vehcileRoute = require("./routes/vehicleroute");
const bookingRoute = require("./routes/bookingroute");
const paymentRoute = require("./routes/paymentroute");
const cookieParser = require("cookie-parser");

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

// Add cookie parsing middleware
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/vehicle", vehcileRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/payment", paymentRoute);

app.get("/test", (req, res) => {
  res.send("server working");
});

app.listen(port, () => console.log(`node server running on port ${port}`));

dbConnection();
