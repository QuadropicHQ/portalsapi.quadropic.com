const dotenv = require("dotenv");
const express = require("express");
const app = express();
const ipmeter = require("./middleware/ipmeter");
const deserializeUser = require("./middleware/secure/userDeserialization");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//FIXME: For Dev environment is setup but PROD env sould be configured
dotenv.config({ path: ".env.test.local" });
const result = dotenv.config({ path: ".env.test.local" });

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Loaded environment variables:", result.parsed);
}

// TODO: ADD CORS after Production
// TODO: ADD Cookie Parser

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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
