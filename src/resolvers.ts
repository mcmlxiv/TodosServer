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

{
  /*const dbs = require("./db");

//Contruct Query through notarealdb json file and graphql
const Query = {
  todoList: () => {
    return dbs.todoList.list();
  },
  user: (root: unknown, { id }: { id: string }) => dbs.users.get(id),
  users: () => dbs.users.list(),
};
//Construct a list of items based on the User Id
const User = {
  todoList: (user: { id: any }) => {
    return dbs.todoList
      .list()
      .filter((todos: { userId: any }) => todos.userId === user.id);
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
    const id = dbs.todoList.create(input);
    return dbs.todoList.get(id);
  },
  deleteTodo: (
    root: unknown,
    { id }: { id: String },
    context: { token: string }
  ) => {
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    return dbs.todoList.delete(id);
  },
  updateTodo: (
    root: unknown,
    { input }: create,
    context: { token: string }
  ) => {
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    return dbs.todoList.update(input);
  },
  //USER CRUD
  createUser: (root: unknown, { input }: createUser) => {
    const userCheck = dbs.todoList
      .list()
      .find((user: { email: string }) => user.email === input.email);
    if (userCheck) {
      const id = dbs.users.create({ error: "Email found" });
      return dbs.users.get(id);
    } else {
      const id = dbs.users.create(input);
      return dbs.users.get(id);
    }
  },
  deleteUser: (root: unknown, { id }: { id: String }) => {
    return dbs.users.delete(id);
  },
  updateUser: (root: unknown, { input }: createUser) => {
    return dbs.users.update(input);
  },
};

module.exports = { Query, Mutation, User };
*/
}
