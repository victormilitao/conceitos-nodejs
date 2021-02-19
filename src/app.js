const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send();
  }

  return next();
}

app.use("/repositories/:id", validateProjectId);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  console.log(title);
  const repository = {
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  var repository = repositories.find(repo => repo.id == id);

  // if (!repository) {
  //   return response.status(400).send()
  // }

  const { title, url, techs } = request.body;

  repository = {
    id,
    title,
    url,
    techs,
    likes: repository.likes
  }

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  // if (repositoryIndex < 0) {
  //   return response.status(400).send()
  // }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id == id);

  // if (!repository) {
  //   return response.status(400).send()
  // }

  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;
