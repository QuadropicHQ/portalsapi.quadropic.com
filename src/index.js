const dotenv = require("dotenv");
const express = require("express");
const app = express();
const ipmeter = require("./middleware/ipmeter");
const deserializeUser = require("./middleware/secure/userDeserialization");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// If prod then env.prod else env.test.local
dotenv.config({
  path: process.env.NODE_ENV == "production" ? ".env.prod" : ".env.test.local",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json({ limit: "4kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "4kb",
  })
);
app.use(ipmeter);
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(deserializeUser);

app.get("/", (req, res) => {
  res.render("serverok", {
    ipaddress: req.ipaddress,
  });
});

const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);
app.use("/biometrics", require("./routes/biometrics"));
app.use("/register", require("./routes/register"));

app.listen(8080);
