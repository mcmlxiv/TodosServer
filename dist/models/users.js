"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define Mongoose schema to allow MongoDB to understand incoming data
const userSchema = new Schema({
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
});
const Users = mongoose.model("User", userSchema);
exports.default = Users;
// const password = "welcome9";
// const uri = `mongodb+srv://mcmlxiv:${password}@todos.pxd2d.mongodb.net/Todos?retryWrites=true&w=majority`;
//
// const User = mongoose.createConnection(uri);
// User.model("User", userSchema);
//
// module.exports = User;
