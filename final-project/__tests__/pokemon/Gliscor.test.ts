import { Status } from "../../src/cli/pokemon/types";
import { Gliscor } from "../../src/cli/pokemon/Gliscor";
import { Snorlax } from "../../src/cli/pokemon/Snorlax";

describe("Gliscor", () => {
  let gliscor: Gliscor;
  let snorlax: Snorlax;

  beforeEach(() => {
    gliscor = new Gliscor();
    snorlax = new Snorlax();
  });

  describe("Earthquake", () => {
    it("should do correct amount of damage", () => {
      gliscor.move1.use(snorlax);
      expect(snorlax.currentHp).toEqual(148);
    });

    it("should KO", () => {
      snorlax.currentHp = 5;
      gliscor.move1.use(snorlax);
      expect(snorlax.currentHp).toEqual(0);
    });
  });

  describe("Roost", () => {
    it("should heal half health", () => {
      gliscor.currentHp = 25;
      gliscor.move2.use(snorlax);
      expect(gliscor.currentHp).toEqual(63);
      expect(snorlax.currentHp).toEqual(snorlax.totalHp);
    });

    it("should heal to full health", () => {
      gliscor.currentHp = 60;
      gliscor.move2.use(snorlax);
      expect(gliscor.currentHp).toEqual(75);
      expect(snorlax.currentHp).toEqual(snorlax.totalHp);
    });
  });

  describe("Protect", () => {
    it("should protect", () => {
      gliscor.move3.use(snorlax);
      expect(gliscor.isProtected).toBe(true);
    });
  });

  describe("Toxic", () => {
    it("should inflict poison if pokemon does not have status", () => {
      gliscor.move4.use(snorlax);
      expect(snorlax.status).toEqual({
        status: Status.Poisoned,
        turnsPassedSinceInflicted: 0,
      });
    });

    it("should not inflict poison if pokemon does have status ailment", () => {
      snorlax.status = {
        status: Status.Sleep,
        turnsPassedSinceInflicted: 3,
      };
      gliscor.move4.use(snorlax);
      expect(snorlax.status).toEqual({
        status: Status.Sleep,
        turnsPassedSinceInflicted: 3,
      });
    });
  });
});
