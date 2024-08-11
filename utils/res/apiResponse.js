class apiRespnse {
  constructor(statusCode, data, message = "Response Recieved ✅") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
