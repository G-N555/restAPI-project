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

  return app;
};

module.exports = { setUpExpressServer };
