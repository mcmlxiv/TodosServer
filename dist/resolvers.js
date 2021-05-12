"use strict";
const dbs = require("./db");
const TodoList = require("../models/todoList");
const connUser = require("../models/userConnection");
//Contruct Query through notarealdb json file and graphql
const Query = {
    // todoList: () => {
    //   return dbs.todoList.list();
    // },
    todoList: async (parent, args, { models: { TodoList }, me }, info) => {
        // if (!me) {
        //   throw new AuthenticationError('You are not authenticated');
        // }
        const posts = await TodoList.find({ author: me.id }).exec();
        return posts;
    },
    user: (root, { id }) => dbs.users.get(id),
    users: connUser.find(),
    //users: () => dbs.users.list(),
};
//Construct a list of items based on the User Id
const User = {
    todoList: (user) => {
        return dbs.todoList
            .list()
            .filter((todos) => todos.userId === user.id);
    },
};
//Mutate JSON data
const Mutation = {
    //TODOS CRUD
    createTodo: (root, { input }, context) => {
        //check user auth using context
        if (!context.token) {
            throw new Error("Unauthorized");
        }
        const id = dbs.todoList.create(input);
        return dbs.todoList.get(id);
    },
    deleteTodo: (root, { id }, context) => {
        if (!context.token) {
            throw new Error("Unauthorized");
        }
        return dbs.todoList.delete(id);
    },
    updateTodo: (root, { input }, context) => {
        if (!context.token) {
            throw new Error("Unauthorized");
        }
        return dbs.todoList.update(input);
    },
    //USER CRUD
    createUser: (root, { input }) => {
        const userCheck = dbs.todoList
            .list()
            .find((user) => user.email === input.email);
        if (userCheck) {
            const id = dbs.users.create({ error: "Email found" });
            return dbs.users.get(id);
        }
        else {
            const id = dbs.users.create(input);
            return dbs.users.get(id);
        }
    },
    deleteUser: (root, { id }) => {
        return dbs.users.delete(id);
    },
    updateUser: (root, { input }) => {
        return dbs.users.update(input);
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
