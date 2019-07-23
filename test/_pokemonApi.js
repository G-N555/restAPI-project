const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../src/server");
chai.should();

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server.setUpExpressServer());
  });

  describe("should return a full list of Pokemon", () => {
    it("should return a full list", async () => {
      const res = await request.get("/api/pokemon");
      res.should.be.json;
      res.body.length.should.eql(151);
    });
    it("should return the number of pokemons", async () => {
      const limit = 5;
      const res = await request.get(`/api/pokemon`).query({ limit: 5 });
      res.should.be.json;
      res.body.length.should.eql(limit);
    });
  });

  describe("should add a pokemon", () => {
    it("should add a pokemon", async () => {
      const res = await request.post("/api/pokemon");
      res.should.be.json;
      res.body.length.should.eql(152);
    });
  });

  describe("should get a pokemon by Id", () => {
    it("should get a pokemon by Id", async () => {
      const res = await request.get("/api/pokemon/42");
      res.body.name.should.eql("Golbat");
    });
    it("should get a pokemon by name", async () => {
      const res = await request.get("/api/pokemon/Mew");
      res.body.id.should.eql("151");
    });
  });

  describe("should modify something in the pokemon", () => {
    it("should modify name", async () => {
      const payload = { name: "Go" };
      const res = await request.patch("/api/pokemon/pikachu").send(payload);
      res.body.name.should.eql("Go");
    });
  });

  describe("should delete a given pokemon", () => {
    it("should delete the given pokemon", async () => {
      const res = await request.delete("/api/pokemon/bulbasaur");
      res.body.name.should.eql("Bulbasaur");
    });
  });

  describe("should return the evolutions", () => {
    it("should return an array", async () => {
      const res = await request.get("/api/pokemon/Charmander/evolutions");
      res.body.length.should.eql(2);
    });
  });

  describe("should return the previous evolutions", () => {
    it("should return an array", async () => {
      const res = await request.get(
        "/api/pokemon/Venusaur/evolutions/previous"
      );
      res.body.length.should.eql(2);
    });

    it("should return an array", async () => {
      const res = await request.get("/api/pokemon/17/evolutions/previous");
      res.body.should.deep.eql([{ id: 16, name: "Pidgey" }]);
    });
  });

  describe("should return the list of all types", () => {
    it("should return the list of all types", async () => {
      const res = await request.get("/api/types");
      res.body.length.should.eql(17);
    });
    it("should return the number of types", async () => {
      const limit = 5;
      const res = await request.get(`/api/types`).query({ limit: 5 });
      res.should.be.json;
      res.body.length.should.eql(limit);
    });
  });

  describe("should add a pokemon type", () => {
    it("should add a pokemon type", async () => {
      const res = await request.post("/api/types");
      res.body.length.should.eql(18);
    });
  });

  describe("should delete a pokemon type by name", () => {
    it("should delete a pokemon type by name", async () => {
      const type = "Electric";
      const res = await request.delete(`/api/types/${type}`);
      res.body.should.eql({ deletedTypes: "Electric" });
    });
  });

  describe("should return a list of pokemon by type", () => {
    it("should return a list of pokemon by type", async () => {
      const type = "Fire";
      const res = await request.get(`/api/types/${type}/pokemon`);
      res.body.length.should.eql(12);
    });
  });

  describe("should return the list of all attacks", () => {
    it("should return the list of all attacks", async () => {
      const res = await request.get("/api/attacks");
      res.body.fast.length.should.eql(41);
      res.body.special.length.should.eql(83);
    });
    it("should return the number of attacks", async () => {
      const limit = 5;
      const res = await request.get(`/api/attacks`).query({ limit: 5 });
      res.should.be.json;
      res.body.length.should.eql(limit);
    });
  });

  describe("should return the list of all fast attacks", () => {
    it("should return the list of all fast attacks", async () => {
      const res = await request.get("/api/attacks/fast");
      res.body.length.should.eql(41);
    });
    it("should return the number of fast attacks", async () => {
      const limit = 5;
      const res = await request.get(`/api/attacks/fast`).query({ limit: 5 });
      res.should.be.json;
      res.body.length.should.eql(limit);
    });
  });

  describe("should return the list of all special attacks", () => {
    it("should return the list of all special attacks", async () => {
      const res = await request.get("/api/attacks/special");
      res.body.length.should.eql(83);
    });
    it("should return the number of special attacks", async () => {
      const limit = 5;
      const res = await request.get(`/api/attacks/special`).query({ limit: 5 });
      res.should.be.json;
      res.body.length.should.eql(limit);
    });
  });

  describe("should return the name of an attack", () => {
    it("should return a specific attack by name", async () => {
      const attack = "Tackle";
      const res = await request.get(`/api/attacks/${attack}`);
      res.should.be.json;
      res.body.name.should.eql(attack);
    });
  });

  describe("should add a pokemon fast attack", () => {
    it("should add a pokemon fast attack", async () => {
      const res = await request.post("/api/attacks/fast");
      res.body.length.should.eql(42);
    });
  });

  describe("should add a pokemon special attack", () => {
    it("should add a pokemon special attack", async () => {
      const res = await request.post("/api/attacks/special");
      res.body.length.should.eql(84);
    });
  });

  describe("should change attack name", () => {
    it("should change attack name", async () => {
      const payload = { name: "GoPunch" };
      const res = await request.patch(`/api/attacks/Tackle`).send(payload);
      res.body.name.should.eql("GoPunch");
    });
  });

  describe("should delete a attack", () => {
    it("should delete a attack", async () => {
      const attack = "GoPunch";
      const res = await request.delete(`/api/attacks/${attack}`);
      res.body.name.should.eql(attack);
    });
  });
});
