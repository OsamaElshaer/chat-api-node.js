const { getDb } = require("../config/database");

exports.Message = class Message {
  constructor(userName, roomName, message, time) {
    this.userName = userName;
    this.roomName = roomName;
    this.message = message;
    this.time = time;
  }
  save() {
    const db = getDb();
    db.collection("messages").insertOne(this);
  }
};
