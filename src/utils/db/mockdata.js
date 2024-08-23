//TODO: Make a new file named as root.js (OR) root.ts to implement same features in PostgresSQL using Prisma

// Mock Users

var users = [
  {
    id: "alexf1",
    name: "Alex Fendrich",
    email: "alexf1@quadropic.com",
    password: "mypass",
  },
  {
    id: "lilflo",
    name: "Little Flower",
    email: "lilflow@quadropic.com",
    password: "mypass",
  },
];

//TODO: IMPORTANT: For SQL dev, let the session be a separate table and add a relation to users table

// Session Data decoded but originally in form of List of IDs which are UNIQUE
var sessions = [
  {
    id: "session1",
    userId: "alexf1",
  },
  {
    id: "session2",
    userId: "lilflo",
  },
  {
    id: "session3",
    userId: "alexf1",
  },
];

//Blocked Users
const blockedUsers = [];

// Temporary Challenges
var challenges = [];

// E-Mail Challenges
var emailChallenges = [];

//Add a new session to user
function createSession(userId, sessionId) {
  sessions.push({ id: sessionId, userId: userId });
  return sessionId;
}

// Remove a session from user
function removeSessionFromUser(userId, sessionId) {
  const session = sessions.find((s) => s.id === sessionId);
  if (session && session.userId === userId) {
    sessions = sessions.filter((s) => s.id !== sessionId);
  }
  return sessionId;
}

// Check Session is Available for particular user
function checkSession(userId, sessionId) {
  const session = sessions.find((s) => s.id === sessionId);
  if (session && session.userId === userId) {
    return true;
  } else {
    return false;
  }
}

// Check User for Login
function checkUser(id, password) {
  let user = users.find((u) => u.id === id);
  if (user && user.password === password) {
    user = { id: user.id, name: user.name, email: user.email };
    return user;
  } else {
    return null;
  }
}

function getUserById(id) {
  const oUser = users.find((u) => u.id === id);
  return {
    id: oUser.id,
    name: oUser.name,
    email: oUser.email,
  };
}

// Add new PassKey
function addPassKey(id, passkeyCreds) {
  //Add passkey to user with given ID in users[]
  users = users.map((u) => {
    if (u.id === id) {
      u.passkey = passkeyCreds;
    }
    return u;
  });
}

//Create Challenge for Passkey verification
function createChallengePayload(userid, challengePay) {
  challenges.push({ user: userid, challenge: challengePay });
  return true;
}

//Get Challenge for Passkey verification and then delete it
function useAndExpireChallenge(userid) {
  const passTemp = challenges.find((p) => p.user === userid);
  challenges = challenges.filter((p) => p.user !== userid);
  return passTemp.challenge;
}

//Get Passkey from User DB
function getPassKey(userid) {
  const user = users.find((u) => u.id === userid);
  return user.passkey;
}

// Make a function that return if there are users with similar id or email given id and email if exists return true
function checkUserExists(id, email, ipadd) {
  let datapay = {};
  const user = users.find((u) => u.id === id || u.email === email);
  if (user) {
    datapay = {
      available: false,
      emailOtp: null,
      errorType: user.id === id ? "id" : "email",
    };
    return datapay;
  }

  //Random 6 digit number for EMAIL CHALLENGE
  const randomEmailChallenge = Math.floor(100000 + Math.random() * 900000);
  emailChallenges.push({ id: id, challenge: randomEmailChallenge });
  datapay = { available: true, emailOtp: randomEmailChallenge, ip: ipadd };
  return datapay;
}

// Add User
function addUser(id, name, email, ip, otp) {
  const emailChallenge = emailChallenges.find((e) => e.id === id);
  if (!emailChallenge || emailChallenge.challenge !== Number(otp)) {
    return null;
  }
  users.push({
    id: id,
    name: name,
    email: email,
  });
  const sid = createSession(id, `session${sessions.length + 1}`);
  return sid;
}

// Block User by removing all sessions
function blockUser(username) {
  sessions = sessions.filter((s) => s.userId !== username);
  blockedUsers.push(username);
  return true;
}

module.exports = {
  checkUser,
  addUser,
  blockUser,
  createSession,
  removeSessionFromUser,
  checkSession,
  getPassKey,
  addPassKey,
  createChallengePayload,
  useAndExpireChallenge,
  checkUserExists,
  getUserById,
};
