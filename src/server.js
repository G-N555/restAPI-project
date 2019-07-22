const pokeData = require("./data");
const express = require("express");
/**
 * Use this file to create and set up your express server
 */
const setUpExpressServer = () => {
  const app = express();
  app.use(express.json());

  app.get("/api/pokemon", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.json(pokeData.pokemon);
    } else {
      res.json(pokeData.pokemon.slice(0, limit));
    }
  });
  app.post("/api/pokemon", (req, res) => {
    pokeData.pokemon.push(req.body);
    res.json(pokeData.pokemon);
  });
  app.get("/api/pokemon/:id", (req, res) => {
    let pokeFindById;
    if (Number(req.params.id)) {
      pokeFindById = pokeData.pokemon.find(
        (pokemon) => ~~pokemon.id === ~~req.params.id
      );
    } else {
      pokeFindById = pokeData.pokemon.find(
        (pokemon) => pokemon.name.toLowerCase() === req.params.id.toLowerCase()
      );
    }
    if (pokeFindById === undefined) {
      res.sendStatus(404);
    } else {
      res.json(pokeFindById);
    }
  });
  //   app.get("/api/pokemon/:name", (req, res) => {
  //     const pokeFindByName = pokeData.pokemon.find(
  //       (pokemon) => pokemon.name.toLowerCase() === req.params.name.toLowerCase()
  //     );
  //     if (pokeFindByName === undefined) {
  //       res.sendStatus(404);
  //     } else {
  //       res.json(pokeFindByName);
  //     }
  //   });

  return app;
};

module.exports = { setUpExpressServer };
