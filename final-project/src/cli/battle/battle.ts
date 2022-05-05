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
    useMonteCarloStrategy?: boolean;
  } = {}
): Promise<OutcomeWithTrackedMoves> => {
  const { verbose, useMonteCarloStrategy } = options;

  if (useMonteCarloStrategy && verbose) {
    console.log(
      `Note that monte carlo strategy only works for Gliscor. When useMonteCarloStrategy is set to true, Snorlax will still use a random strategy.`
    );
  }

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
    verbose &&
      console.log("---------------------------------------------------");
    verbose &&
      console.log(
        `Turn: ${turn}, ${pokemon1.name}: ${pokemon1.currentHp} hp, ${pokemon2.name}: ${pokemon2.currentHp} hp`
      );
    verbose && console.log("----------");
    outcome = await handleTurn(
      fasterPokemon,
      slowerPokemon,
      fasterPokemonTrackedMoves,
      { verbose, useMonteCarloStrategy }
    );
    if (outcome.outcome) break;
    turn++;

    /**
     * Slower Pokemon's turn.
     */
    verbose &&
      console.log("---------------------------------------------------");
    verbose &&
      console.log(
        `Turn: ${turn}, ${pokemon1.name}: ${pokemon1.currentHp} hp, ${pokemon2.name}: ${pokemon2.currentHp} hp`
      );
    verbose && console.log("----------");
    outcome = await handleTurn(
      slowerPokemon,
      fasterPokemon,
      slowerPokemonTrackedMoves,
      { verbose, useMonteCarloStrategy }
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
