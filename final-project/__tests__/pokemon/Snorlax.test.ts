import { Status } from "../../src/cli/pokemon/types";
import { Gliscor } from "../../src/cli/pokemon/Gliscor";
import { Snorlax } from "../../src/cli/pokemon/Snorlax";

describe("Snorlax", () => {
  let gliscor: Gliscor;
  let snorlax: Snorlax;

  beforeEach(() => {
    gliscor = new Gliscor();
    snorlax = new Snorlax();
  });

  describe("Rest", () => {
    it("should override status ailments and heal hp", () => {
      snorlax.currentHp = 20;
      snorlax.status = {
        status: Status.Poisoned,
        turnsPassedSinceInflicted: 2,
      };
      snorlax.move1.use(gliscor);
      expect(snorlax.currentHp).toEqual(160);
      expect(snorlax.status).toEqual({
        status: Status.Sleep,
        turnsPassedSinceInflicted: 0,
      });
    });
  });

  describe("Fire Punch", () => {
    it("should damage opponent", () => {
      snorlax.move2.use(gliscor);
      expect(gliscor.currentHp).toEqual(57);
    });
  });

  describe("Body Slam", () => {
    it("should damage opponent", () => {
      snorlax.move3.use(gliscor);
      expect(gliscor.currentHp).toEqual(62);
    });
  });

  describe("Crunch", () => {
    it("should damage opponent", () => {
      snorlax.move4.use(gliscor);
      expect(gliscor.currentHp).toEqual(56);
    });
  });
});
