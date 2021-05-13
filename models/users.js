const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define Mongoose schema to allow MongoDB to understand incoming data

const userSchema = new Schema(
  {
    id: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    todoList: {
      id: String,
      Date: String,
      text: String,
      title: String,
      todoChange: String,
      todosActive: Boolean,
      todosPin: Boolean,
      userId: String,
    },
  },
  {
    collection: "users",
  }
);

const Users = mongoose.model("User", userSchema);
module.exports = Users;
