"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ApolloServer, gql } = require("apollo-server-express");
const fs = require("fs"); //node js file system
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const resolvers = require("./resolvers");
const db = require("./db");
const TodoList = require("../models/todoList");
const { User, getUserLoader } = require("../models/todoList");
const port = 9000;
const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");
//refresh token for expired tokens
const refreshToken = [];
const app = express();
app.use(cors(), bodyParser.json(), expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
    algorithms: ["RS256"], //RS digital signature needed for auth
}));
//Todo Need to put Password in ENV DO NOT LEAVE HERE
const password = "welcome9";
const uri = `mongodb+srv://mcmlxiv:${password}@todos.pxd2d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//MongoDB
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => console.log(error, "error"));
mongoose.connection.on("error", (err) => {
    console.log(err);
});
mongoose.connection.once("open", () => {
    console.log("connected!");
});
mongoose.connection.collection("users", console.log("s"));
// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//Setting up GQL
const typeDefs = gql(fs.readFileSync("schema/schema.graphql", { encoding: "utf8" }));
//context from jwtToken from user to add auth to server
const context = ({ req }) => ({
    userLoader: getUserLoader(),
});
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
});
apolloServer.applyMiddleware({ app, path: "/graphql" });
//Post req for user Validation
app.post("/login", (req, res) => {
    //incoming email and pass from client
    const { email, password } = req.body;
    //db user list
    const user = db.users
        .list()
        .find((user) => user.email === email);
    //Validation checking if email exist in user db
    if (!user) {
        const token = "case 1";
        res.status(401).send(token);
        return;
        //if password belongs to that email entered
    }
    else if (user && !(user.password === password)) {
        const token = "case 2";
        res.status(401).send(token);
        return;
    }
    //sending token with jwtSecret
    const token = jwt.sign({ sub: user.id }, jwtSecret, {
        algorithm: "HS256",
        expiresIn: "1d",
    });
    //refreshToken.push(token);
    res.status(200).send({ token, user });
});
app.post("/signup", (req, res
// req: { body: { email: string; id: string } },
// res: {
//   status: (arg0: number) => any;
//   send: (arg0: { token: string }) => void;
// }
) => {
    //incoming email and pass from client
    const { email } = req.body;
    //db user list
    const user = db.users
        .list()
        .find((user) => user.email === email);
    //sending token with jwtSecret
    const token = jwt.sign({ sub: user.id }, jwtSecret, {
        algorithm: "HS256",
        expiresIn: "1h",
    });
    res.status(200).send({ token, user });
});
app.listen(port, () => console.info(`Server started on port ${port}`));
{
    /*const { ApolloServer, gql } = require("apollo-server-express");
  const fs = require("fs"); //node js file system
  //Express Logic
  import { Db, MongoClient } from "mongodb";
  
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const express = require("express");
  const expressJwt = require("express-jwt");
  import { Request, Response } from "express";
  
  const jwt = require("jsonwebtoken");
  const mongoose = require("mongoose");
  import { makeExecutableSchema } from "graphql-tools";
  
  const resolvers = require("./resolvers");
  const db = require("./db");
  
  const port = 9000;
  const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");
  //refresh token for expired tokens
  const refreshToken = [];
  const app = express();
  app.use(
    cors(),
    bodyParser.json(),
    expressJwt({
      secret: jwtSecret,
      credentialsRequired: false,
      algorithms: ["RS256"], //RS digital signature needed for auth
    })
  );
  //Todo Need to put Password in ENV DO NOT LEAVE HERE
  const password = "welcome9";
  const uri = `mongodb+srv://mcmlxiv:${password}@todos.pxd2d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  
  //MongoDB
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.once("open", () => {
    console.log("connected!");
  });
  // const MongoClient = require('mongodb').MongoClient;
  // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // client.connect(err => {
  //   const collection = client.db("test").collection("devices");
  //   // perform actions on the collection object
  //   client.close();
  // });
  //Setting up GQL
  const typeDefs = gql(
    fs.readFileSync("schema/schema.graphql", { encoding: "utf8" })
  );
  //context from jwtToken from user to add auth to server
  const context = ({ req }: { req: Request }) => ({
    token: req.headers.userauthorization || "",
  });
  
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  
  //Post req for user Validation
  app.post(
    "/login",
    (
      req: { body: { email: string; password: string } },
      res: {
        status: (arg0: number) => any;
        send: (arg0: { token: string }) => void;
      }
    ) => {
      //incoming email and pass from client
      const { email, password } = req.body;
  
      //db user list
      const user = db.users
        .list()
        .find((user: { email: string }) => user.email === email);
  
      //Validation checking if email exist in user db
      if (!user) {
        const token = "case 1";
        res.status(401).send(token);
  
        return;
        //if password belongs to that email entered
      } else if (user && !(user.password === password)) {
        const token = "case 2";
        res.status(401).send(token);
  
        return;
      }
      //sending token with jwtSecret
  
      const token = jwt.sign({ sub: user.id }, jwtSecret, {
        algorithm: "HS256",
        expiresIn: "1d",
      });
      //refreshToken.push(token);
  
      res.status(200).send({ token, user });
    }
  );
  app.post(
    "/signup",
    (
      req: Request,
      res: Response
      // req: { body: { email: string; id: string } },
      // res: {
      //   status: (arg0: number) => any;
      //   send: (arg0: { token: string }) => void;
      // }
    ) => {
      //incoming email and pass from client
      const { email } = req.body;
      //db user list
      const user = db.users
        .list()
        .find((user: { email: string }) => user.email === email);
  
      //sending token with jwtSecret
      const token = jwt.sign({ sub: user.id }, jwtSecret, {
        algorithm: "HS256", //RS256 private key HS256 public key
        expiresIn: "1h",
      });
      res.status(200).send({ token, user });
    }
  );
  
  app.listen(port, () => console.info(`Server started on port ${port}`));*/
}
