const { signJWT } = require("../jwt/root");

const {
  createSession,
  removeSessionFromUser,
  checkUser,
} = require("../db/mockdata"); //FIXME: When COde completed replace MockData with Root

function createSessionController(req, res) {
  const { id, password } = req.body;
  // const user = checkUser(id, password);
  const user = {
    id: "alexf1",
    name: "Alex",
    email: "alexf1@quadropic.com",
    password: "mypass",
  };
  if (user == null) {
    return res.status(401).send("Invalid credentials");
  }

  // Create a session
  const session = createSession(user.id, "samplesession");

  //CREATE ACCESS TOKEN
  const accessToken = signJWT({ id: user.id, sessionId: session }, "5m");

  // SET ACCESS TOKEN COOKIE
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000, // 5 Minutes
    //TODO: secure: true, ENFORCE HTTPS
  });

  // CREATE REFRESH TOKEN
  const refreshToken = signJWT(
    { sessionId: session, ip: req.ipaddress, userId: user.id },
    true
  );

  // SET REFRESH TOKEN COOKIE
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 183 * 24 * 60 * 60 * 1000, //183 Days
    //TODO: secure: true, ENFORCE HTTPS
  });

  return res.send("Session Created");
}

function removeSessionController(req, res) {
  removeSessionFromUser(req.user, req.sessionId);
  res.send("Session removed");
}

function removeThisSession(req, res) {
  removeSessionFromUser(req.user, req.sessionId);
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.send("Session removed");
}

function checkSessionController(req, res) {
  return res.send(req.user);
}

module.exports = {
  createSessionController,
  removeSessionController,
  removeThisSession,
  checkSessionController,
};
