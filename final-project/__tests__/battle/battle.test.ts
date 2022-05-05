import { battle } from "../../src/cli/battle/battle";
import { Gliscor } from "../../src/cli/pokemon/Gliscor";
import { Snorlax } from "../../src/cli/pokemon/Snorlax";

describe("Battle", () => {
  let gliscor: Gliscor;
  let snorlax: Snorlax;

  beforeEach(() => {
    gliscor = new Gliscor();
    snorlax = new Snorlax();
  });

  it("should be able to simulate a battle without crashing", async () => {
    const outcome = await battle(gliscor, snorlax);
    expect(outcome.outcome).toBeTruthy();
    expect(outcome.pokemon1TrackedMoves.length).toBeGreaterThan(0);
    expect(outcome.pokemon2TrackedMoves.length).toBeGreaterThan(0);
  });
});
