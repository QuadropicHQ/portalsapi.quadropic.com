const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new session
async function createSession(username, sessionId) {
  await prisma.user.update({
    where: { username },
    data: {
      sessions: {
        push: sessionId,
      },
    },
  });
  return sessionId;
}

// Remove a session from user
async function removeSessionFromUser(username, sessionId) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (user) {
    const updatedSessions = user.sessions.filter((id) => id !== sessionId);
    await prisma.user.update({
      where: { username },
      data: { sessions: updatedSessions },
    });
  }

  return sessionId;
}

// Check if a session is available for a particular user
async function checkSession(username, sessionId) {
  const user = await prisma.user.findUnique({ where: { username } });
  return user?.sessions.includes(sessionId) || false;
}

// Check user for login
async function checkUser(username, password) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { username: true, name: true, email: true, passkey: true },
  });

  if (user && user.passkey?.password === password) {
    const { passkey, ...userInfo } = user;
    return userInfo;
  }

  return null;
}

// Get user by ID
async function getUserById(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { username: true, name: true, email: true },
  });

  return user;
}

// Add new passkey
async function addPassKey(username, passkeyCreds) {
  await prisma.user.update({
    where: { username },
    data: { passkey: passkeyCreds },
  });
}

// Create challenge for passkey verification
async function createChallengePayload(uid, challengePay, ipadd) {
  await prisma.challenge.create({
    data: { uid, challenge: challengePay, ipaddress: ipadd },
  });
}

// Get challenge for passkey verification and then delete it
async function useAndExpireChallenge(uid) {
  const challenge = await prisma.challenge.findUnique({ where: { uid } });
  if (challenge) {
    await prisma.challenge.delete({ where: { uid: challenge.uid } });
    return challenge.challenge;
  }

  return null;
}

// Get passkey from User DB
async function getPassKey(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { passkey: true },
  });

  return user?.passkey;
}

// Check if users with similar username or email exist
async function checkUserExists(username, email, ipadd) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (user) {
    return {
      available: false,
      emailOtp: null,
      errorType: user.username === username ? "username" : "email",
    };
  }

  const randomEmailChallenge = Math.floor(100000 + Math.random() * 900000);

  await prisma.emailChallenge.create({
    data: {
      uid: username,
      challenge: String(randomEmailChallenge),
      ipaddress: ipadd,
    },
  });

  return {
    available: true,
    emailOtp: randomEmailChallenge,
    ip: ipadd,
  };
}

// Add user
async function addUser(username, name, email, dob, otp, ip) {
  const emailChallenge = await prisma.emailChallenge.findUnique({
    where: { uid: username },
  });

  if (!emailChallenge || emailChallenge.challenge !== otp) {
    return null;
  }

  const user = await prisma.user.create({
    data: {
      username,
      name,
      email,
      sessions: [],
    },
  });

  return username;
}

// Block user by removing all sessions
async function blockUser(username) {
  await prisma.user.update({
    where: { username },
    data: { sessions: [] },
  });

  // Implement logic to handle blocked users as per your application needs
  // For example, adding the user to a blocked list or updating the user status in the DB.
  return true;
}

async function setupMisc(id, dob, about, country) {
  const dobDate = new Date(dob);
  await prisma.user.update({
    where: { id },
    data: { dob: dobDate, about, country },
  });
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
  setupMisc,
};
