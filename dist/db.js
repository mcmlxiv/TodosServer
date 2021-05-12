"use strict";
//Persistence layer
//to store Data in a JSON file we use notarealdb
//this lets us define data in its own JSON file like jobs
//to access this data we need to import it and return the obj
Object.defineProperty(exports, "__esModule", { value: true });
const notarealdb_1 = require("notarealdb");
const store = new notarealdb_1.DataStore("./data");
module.exports = {
    users: store.collection("users"),
    todoList: store.collection("todoList"),
};
