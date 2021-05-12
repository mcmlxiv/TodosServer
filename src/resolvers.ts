//mongoose User and TodoLis Models
const Users = require("./models/users");
const TodoList = require("./models/todoList");

//Define Mongoose schema to allow MongoDB to understand incoming data

//Contruct Query through notarealdb json file and graphql
const Query = {
  todoList: async () => {
    return TodoList.find({});
  },
  user: async (root: unknown, { id }: { id: string }) =>
    await Users.findOne({ id }),
  users: async () => {
    return await Users.find({});
  },
};

//Construct a list of items based on the User Id
const User = {
  todoList: ({ id }: { id: string }) => {
    return TodoList.find({ userId: id });
  },
};

interface create {
  input: {
    Date: String;
    text: String;
    title: String;
    todoChange: String;
    todosActive: Boolean;
    todosPin: Boolean;
    id: String;
    userId: String;
  };
}

interface createUser {
  input: {
    id: String;
    email: String;
    password: String;
    firstName: String;
    lastName: String;
  };
}
//Mutate JSON data
const Mutation = {
  //TODOS CRUD
  createTodo: (
    root: unknown,
    { input }: create,
    context: { token: string }
  ) => {
    //check user auth using context
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    let TodosList = new TodoList({
      id: input.id,
      Date: input.Date,
      text: input.text,
      title: input.title,
      todoChange: input.todoChange,
      todosActive: input.todosActive,
      todosPin: input.todosPin,
      userId: input.userId,
    });
    return TodosList.save();
  },
  deleteTodo: async (
    root: unknown,
    { id }: { id: String },
    context: { token: string }
  ) => {
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    let todoList = await TodoList.findOne({ id });
    todoList.delete();
  },
  updateTodo: async (
    root: unknown,
    { input }: create,
    context: { token: string }
  ) => {
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    let todoList = await TodoList.findOne({ id: input.id });
    todoList.overwrite(input);
    return await todoList.save();
  },
  //USER CRUD
  createUser: (root: unknown, { input }: createUser) => {
    let user = new Users({
      id: input.id,
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    });
    return user.save();
  },
  deleteUser: async (root: unknown, { id }: { id: String }) => {
    let user = await Users.findOne({ id });
    user.delete();
  },
  updateUser: async (root: unknown, { input }: createUser) => {
    let user = await Users.findOne({ id: input.id });
    user.overwrite(input);
    return await user.save();
  },
};

module.exports = { Query, Mutation, User };
