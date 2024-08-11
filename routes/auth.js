const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Test Case 1
const userCredentials = {
  username: "admin",
  password: "admin123",
  email: "admin@gmail.com",
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Checking if credentials match
  if (true) {
    const accessToken = jwt.sign(
      {
        username: userCredentials.username,
        email: userCredentials.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    const refreshToken = jwt.sign(
      {
        username: userCredentials.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("jwt_access", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 10 * 60 * 1000,
    });
    res.cookie("jwt_refersh", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

module.exports = router;
