const dotenv = require("dotenv");
const express = require("express");
const app = express();
const ipmeter = require("./middleware/ipmeter");
const deserializeUser = require("./middleware/secure/userDeserialization");
const cookieParser = require("cookie-parser");

//FIXME: For Dev environment is setup but PROD env sould be configured
dotenv.config();

// TODO: ADD CORS after Production
// TODO: ADD Cookie Parser
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

app.listen(8080);
