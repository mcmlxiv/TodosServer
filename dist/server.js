"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server-express");
const fs = require("fs"); //node js file system
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const resolvers = require("./resolvers");
const Users = require("./models/users");
const port = process.env.PORT || 7000;
const jwtSecret = Buffer.from(String(process.env.JWT_SECRET), "base64");
//refresh token for expired tokens
const app = express();
app.options("*", cors());
app.get("/", function (req, res) {
    res.send("hello Todos");
});
app.use(cors(), bodyParser.json(), expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
    algorithms: ["RS256"], //RS digital signature needed for auth
}));
//MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
    console.log("connected!");
});
//Setting up GQL
const typeDefs = gql(fs.readFileSync("schema/schema.graphql", { encoding: "utf8" }));
//context from jwtToken from user to add auth to server
const context = ({ req }) => ({
    token: req.headers.userauthorization || "",
});
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
});
apolloServer.applyMiddleware({ app, path: "/graphql" });
//Post req for user Validation
app.post("/login", cors(), async (req, res) => {
    //incoming email and pass from client
    const { email, password } = req.body;
    //db user list
    const userFind = async () => Users.findOne({ email: email });
    const user = await userFind();
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
    res.status(200).send({ token, user });
});
app.post("/signup", cors(), async (req, res) => {
    //incoming email and pass from client
    const { email } = req.body;
    const userFind = async () => Users.findOne({ email: email });
    const user = await userFind();
    //sending token with jwtSecret
    const token = jwt.sign({ sub: user.id }, jwtSecret, {
        algorithm: "HS256",
        expiresIn: "1h",
    });
    res.status(200).send({ token, user });
});
app.listen(port, () => console.info(`Server started on port ${port}`));
