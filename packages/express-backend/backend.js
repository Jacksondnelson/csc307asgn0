// backend.js
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("No way!");
});
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};
const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job

  );
};

/*const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);*/


const genterateId = () => {
  return Math.random().toString();
}

/*const addUser = (user) => {
  const id = genterateId();
  const completeuser = {id , ... user}
  users["users_list"].push(completeuser);
  return completeuser;
};*/



app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  
  let promise = userService.getUsers(name, job);
  promise.then((result) => {
    result = { users_list: result };
    res.send(result);
  })
});
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let promise = userService.findUserById(id);
  promise.then((result) => {
    if (result === null) {
      res.status(404).send("Resource not found.");
    } else {
      console.log("result is ", result);
      res.send(result);
    }
  }).catch((error) => {
    res.status(400).send(error)
  })
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const promise = userService.addUser(userToAdd);
  promise.then((user) => {
    res.status(201).send(user);
  })
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let promise = userService.findUserById(id);
  promise.then((result) => {
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
     /*const location = users.users_list.findIndex(user => user.id == id);
      users.users_list.splice(location, 1);
      res.status(204).send()*/
      const promise = userService.deleteUser(id)
      promise.then(() => {
        res.status(204).send();
      })
    
    }
  })
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});


