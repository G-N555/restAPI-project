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
  app.get("/api/pokemon/:idOrName/evolutions/previous", (req, res) => {
    const pokeFindById = findPokemon(req, "idOrName");
    if (pokeFindById === undefined) {
      res.sendStatus(404);
    } else {
      let evolutions = pokeFindById["Previous evolution(s)"];
      if (evolutions === undefined) {
        evolutions = [];
      }
      if (!Array.isArray(evolutions)) {
        evolutions = [evolutions];
      }
      res.json(evolutions);
    }
  });

  app.get("/api/types", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.json(pokeData.types);
    } else {
      res.json(pokeData.types.slice(0, limit));
    }
  });

  app.post("/api/types", (req, res) => {
    pokeData.types.push(req.body);
    res.json(pokeData.types);
  });

  app.delete("/api/types/:idOrName", (req, res) => {
    const index = _.findIndex(
      pokeData.types,
      (type) => type === req.params.idOrName
    );
    if (index === -1) {
      res.sendStatus(404);
    } else {
      const type = pokeData.types.splice(index, 1);
      res.json({ deletedTypes: type[0] });
    }
  });

  app.get("/api/types/:idOrName/pokemon", (req, res) => {
    const index = _.findIndex(
      pokeData.types,
      (type) => type === req.params.idOrName
    );
    if (index === -1) {
      res.sendStatus(404);
    } else {
      const pokemonsByType = pokeData.pokemon.filter((pokemon) => {
        if (pokemon.types) {
          return pokemon.types.includes(pokeData.types[index]);
        }
        return false;
      });
      res.json(pokemonsByType);
    }
  });

  app.get("/api/attacks", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.json(pokeData.attacks);
    } else {
      const fast = pokeData.attacks.fast;
      const special = pokeData.attacks.special;
      const combine = fast.concat(special);
      res.json(combine.slice(0, limit));
    }
  });

  app.get("/api/attacks/fast", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.json(pokeData.attacks.fast);
    } else {
      const fast = pokeData.attacks.fast;
      res.json(fast.slice(0, limit));
    }
  });

  app.get("/api/attacks/special", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.json(pokeData.attacks.special);
    } else {
      const special = pokeData.attacks.special;
      res.json(special.slice(0, limit));
    }
  });
  app.get("/api/attacks/:name", (req, res) => {
    const fast = pokeData.attacks.fast;
    const special = pokeData.attacks.special;
    const combine = fast.concat(special);
    const attack = _.find(combine, (attack) => attack.name === req.params.name);

    if (attack === undefined) {
      res.sendStatus(404);
    } else {
      res.json(attack);
    }
  });

  app.get("/api/attacks/:name/pokemon", (req, res) => {
    const pokemon = pokeData.pokemon.filter((pokemon) => {
      return (
        pokemon.attacks.fast.includes(req.params.name) ||
        pokemon.attacks.special.includes(req.params.name)
      );
    });
    if (pokemon.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(pokemon);
    }
  });

  app.post("/api/attacks/fast", (req, res) => {
    pokeData.attacks.fast.push(req.body);
    res.json(pokeData.attacks.fast);
  });

  app.post("/api/attacks/special", (req, res) => {
    pokeData.attacks.special.push(req.body);
    res.json(pokeData.attacks.special);
  });

  app.patch("/api/attacks/:name", (req, res) => {
    const fast = pokeData.attacks.fast;
    const special = pokeData.attacks.special;
    const combine = fast.concat(special);
    const attack = _.find(combine, (attack) => attack.name === req.params.name);
    _.extend(attack, req.body);
    res.json(attack);
  });

  app.delete("/api/attacks/:name", (req, res) => {
    const fast = pokeData.attacks.fast;
    const special = pokeData.attacks.special;
    const fastIndex = _.findIndex(
      fast,
      (attack) => attack.name === req.params.name
    );
    const specialIndex = _.findIndex(
      special,
      (attack) => attack.name === req.params.name
    );
    let attack;
    if (fastIndex === -1 && specialIndex === -1) {
      res.setStatus(404);
    } else if (fastIndex !== -1) {
      attack = pokeData.attacks.fast.splice(fastIndex, 1);
    } else {
      attack = pokeData.attacks.special.splice(specialIndex, 1);
    }
    res.json(...attack);
  });

  return app;
};

module.exports = { setUpExpressServer };
