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
      const res = await request.get("/api/pokemon/:idOrName/evolutions");
      //res.body.length.should.eql()
    });
  });
});
