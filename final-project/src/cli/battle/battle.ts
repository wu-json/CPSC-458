import { Pokemon } from "../pokemon/types";
import {
  applyPregameItemUpdates,
  checkForOutcome,
  handleTurn,
  Outcome,
} from "./utils";
import { TrackedMove } from "./types";

interface OutcomeWithTrackedMoves extends Outcome {
  pokemon1TrackedMoves: TrackedMove[];
  pokemon2TrackedMoves: TrackedMove[];
}

export const battle = async (
  pokemon1: Pokemon,
  pokemon2: Pokemon,
  options: {
    verbose?: boolean;
  } = {}
): Promise<OutcomeWithTrackedMoves> => {
  const { verbose } = options;

  /**
   * We store tracked moves for each pokemon here.
   */
  let pokemon1TrackedMoves: TrackedMove[] = [];
  let pokemon2TrackedMoves: TrackedMove[] = [];

  let turn = 0;
  let outcome: Outcome = checkForOutcome(pokemon1, pokemon2);

  applyPregameItemUpdates(pokemon1, verbose);
  applyPregameItemUpdates(pokemon2, verbose);

  while (pokemon1.currentHp > 0 || pokemon2.currentHp > 0) {
    /**
     * Figure out which order the Pokemon will make their moves.
     */
    const [fasterPokemon, fasterPokemonTrackedMoves] =
      pokemon1.speed >= pokemon2.speed
        ? [pokemon1, pokemon1TrackedMoves]
        : [pokemon2, pokemon2TrackedMoves];

    const [slowerPokemon, slowerPokemonTrackedMoves] =
      pokemon1.speed >= pokemon2.speed
        ? [pokemon2, pokemon2TrackedMoves]
        : [pokemon1, pokemon1TrackedMoves];

    /**
     * Figure out which tracked moves
     */

    /**
     * Faster Pokemon's turn.
     */
    verbose && console.log("---------------------------------");
    verbose &&
      console.log(
        `Turn: ${turn}, ${pokemon1.name}: ${pokemon1.currentHp} hp, ${pokemon2.name}: ${pokemon2.currentHp} hp`
      );
    outcome = handleTurn(
      fasterPokemon,
      slowerPokemon,
      fasterPokemonTrackedMoves,
      verbose
    );
    if (outcome.outcome) break;
    turn++;

    /**
     * Slower Pokemon's turn.
     */
    verbose && console.log("---------------------------------");
    verbose &&
      console.log(
        `Turn: ${turn}, ${pokemon1.name}: ${pokemon1.currentHp} hp, ${pokemon2.name}: ${pokemon2.currentHp} hp`
      );
    outcome = handleTurn(
      slowerPokemon,
      fasterPokemon,
      slowerPokemonTrackedMoves,
      verbose
    );
    if (outcome.outcome) break;
    turn++;
  }

  verbose && console.log("---------------------------------");
  if (outcome.outcome === "winner") {
    verbose &&
      console.log(
        `Outcome: ${outcome.winner?.name} won with ${outcome.winner?.currentHp} hp remaining!`
      );
  } else {
    verbose && console.log(`Outcome: draw!`);
  }

  return {
    ...outcome,
    pokemon1TrackedMoves,
    pokemon2TrackedMoves,
  };
};
