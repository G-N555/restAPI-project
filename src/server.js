const pokeData = require("./data");
const express = require("express");
const _ = require("underscore");
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

  function findPokemon(req, param) {
    const id = req.params[param];
    const pokemons = pokeData.pokemon;
    if (Number(id)) {
      return pokemons.find((pokemon) => ~~pokemon.id === ~~id);
    }
    return pokemons.find(
      (pokemon) => pokemon.name.toLowerCase() === id.toLowerCase()
    );
  }

  app.get("/api/pokemon/:id", (req, res) => {
    const pokeFindById = findPokemon(req, "id");

    if (pokeFindById === undefined) {
      res.sendStatus(404);
    } else {
      res.json(pokeFindById);
    }
  });

  app.patch("/api/pokemon/:idOrName", (req, res) => {
    const pokeFindById = findPokemon(req, "idOrName");
    if (pokeFindById === undefined) {
      res.sendStatus(404);
    } else {
      _.extend(pokeFindById, req.body);
      res.json(pokeFindById);
    }
  });
  app.delete("/api/pokemon/:idOrName", (req, res) => {
    const pokeFindById = findPokemon(req, "idOrName");
    if (pokeFindById === undefined) {
      res.sendStatus(404);
    } else {
      const index = pokeData.pokemon.indexOf(pokeFindById);
      const pokemon = pokeData.pokemon.splice(index, 1);
      res.json(...pokemon);
    }
  });
  app.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    const pokeFindById = findPokemon(req, "idOrName");
    if (pokeFindById === undefined) {
      res.sendStatus(404);
    } else {
      let evolutions = pokeFindById.evolutions;
      if (evolutions === undefined) {
        evolutions = [];
      }
      res.json(evolutions);
    }
  });
  return app;
};

module.exports = { setUpExpressServer };
