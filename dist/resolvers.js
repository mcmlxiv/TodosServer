"use strict";
//mongoose User and TodoLis Models
const Users = require("../models/users"); //../dist/models/users
const TodoList = require("../models/todoList");
//Define Mongoose schema to allow MongoDB to understand incoming data
//Contruct Query through notarealdb json file and graphql
const Query = {
    todoList: async () => {
        return TodoList.find({});
    },
    user: async (root, { id }) => await Users.findOne({ id }),
    users: async () => {
        return await Users.find({});
    },
};
//Construct a list of items based on the User Id
const User = {
    todoList: ({ id }) => {
        return TodoList.find({ userId: id });
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
    deleteTodo: async (root, { id }, context) => {
        if (!context.token) {
            throw new Error("Unauthorized");
        }
        let todoList = await TodoList.findOne({ id });
        todoList.delete();
    },
    updateTodo: async (root, { input }, context) => {
        if (!context.token) {
            throw new Error("Unauthorized");
        }
        let todoList = await TodoList.findOne({ id: input.id });
        todoList.overwrite(input);
        return await todoList.save();
    },
    //USER CRUD
    createUser: (root, { input }) => {
        let user = new Users({
            id: input.id,
            email: input.email,
            password: input.password,
            firstName: input.firstName,
            lastName: input.lastName,
        });
        return user.save();
    },
    deleteUser: async (root, { id }) => {
        let user = await Users.findOne({ id });
        user.delete();
    },
    updateUser: async (root, { input }) => {
        let user = await Users.findOne({ id: input.id });
        user.overwrite(input);
        return await user.save();
    },
};
module.exports = { Query, Mutation, User };
