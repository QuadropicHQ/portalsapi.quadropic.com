function getSessionId(userid) {
  return `${userid}-${Date.now()}`;
}

module.exports = {
  getSessionId,
};
