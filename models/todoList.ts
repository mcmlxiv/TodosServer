const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define Mongoose schema to allow MongoDB to understand incoming data
const todoListSchema = new Schema({
  id: String,
  Date: String,
  text: String,
  title: String,
  todoChange: String,
  todosActive: Boolean,
  todosPin: Boolean,
  userId: String,
});

const TodoList = mongoose.model("TodoList", todoListSchema);
export default TodoList;
