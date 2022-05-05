import {
  applyPostTurnItemUpdates,
  applyPostTurnStatusUpdates,
  checkForOutcome,
  hasAvailableMoves,
} from "../../src/cli/battle/utils";
import { Item, Status } from "../../src/cli/pokemon/types";
import { Gliscor } from "../../src/cli/pokemon/Gliscor";
import { Snorlax } from "../../src/cli/pokemon/Snorlax";

describe("Utils", () => {
  let gliscor: Gliscor;
  let snorlax: Snorlax;

  beforeEach(() => {
    gliscor = new Gliscor();
    snorlax = new Snorlax();
  });

  describe("hasAvailableMoves", () => {
    it("should return true if available moves", () => {
      expect(hasAvailableMoves(gliscor)).toBe(true);
      gliscor.move1.currentPP = 0;
      gliscor.move2.currentPP = 0;
      gliscor.move3.currentPP = 0;
      gliscor.move4.currentPP = 0;
      expect(hasAvailableMoves(gliscor)).toBe(false);
    });
  });

  describe("checkForOutcome", () => {
    it("should return draw if a pokemon has no available moves", () => {
      gliscor.move1.currentPP = 0;
      gliscor.move2.currentPP = 0;
      gliscor.move3.currentPP = 0;
      gliscor.move4.currentPP = 0;
      expect(checkForOutcome(gliscor, snorlax)).toEqual({ outcome: "draw" });
    });

    it("should return the correct winner", () => {
      gliscor.currentHp = 0;
      expect(checkForOutcome(gliscor, snorlax)).toEqual({
        outcome: "winner",
        winner: snorlax,
      });
    });
  });

  describe("applyPostTurnStatusUpdates", () => {
    it("should do nothing if no status is applied", () => {
      applyPostTurnStatusUpdates(snorlax);
      expect(snorlax.currentHp).toEqual(snorlax.totalHp);
    });

    it("should inflict poison damage", () => {
      snorlax.status = {
        status: Status.Poisoned,
        turnsPassedSinceInflicted: 0,
      };
      applyPostTurnStatusUpdates(snorlax);
      expect(snorlax.currentHp).toEqual(150);
      expect(snorlax.status.turnsPassedSinceInflicted).toEqual(1);
    });

    it("should inflict more poison damage", () => {
      snorlax.status = {
        status: Status.Poisoned,
        turnsPassedSinceInflicted: 2,
      };
      applyPostTurnStatusUpdates(snorlax);
      expect(snorlax.currentHp).toEqual(130);
      expect(snorlax.status.turnsPassedSinceInflicted).toEqual(3);
    });

    it("should heal hp if poison heal ability is present", () => {
      gliscor.status = {
        status: Status.Poisoned,
        turnsPassedSinceInflicted: 2,
      };
      gliscor.currentHp = 32;
      applyPostTurnStatusUpdates(gliscor);
      expect(gliscor.currentHp).toEqual(41);
      expect(gliscor.status.turnsPassedSinceInflicted).toEqual(3);
    });
  });

  describe("applyPostTurnItemUpdates", () => {
    it("should make leftovers restore some hp", () => {
      snorlax.item = Item.Leftovers;
      snorlax.currentHp = 20;
      applyPostTurnItemUpdates(snorlax);
      expect(snorlax.currentHp).toEqual(30);
    });
  });
});
