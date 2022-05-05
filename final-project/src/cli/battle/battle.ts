import { Pokemon } from "../pokemon/types";
import {
  applyPregameItemUpdates,
  checkForOutcome,
  handleTurn,
  Outcome,
} from "./utils";

export const battle = async (
  pokemon1: Pokemon,
  pokemon2: Pokemon
): Promise<Outcome> => {
  let turn = 0;
  let outcome: Outcome = checkForOutcome(pokemon1, pokemon2);

  applyPregameItemUpdates(pokemon1);
  applyPregameItemUpdates(pokemon2);

  while (pokemon1.currentHp > 0 || pokemon2.currentHp > 0) {
    /**
     * Figure out which order the Pokemon will make their moves.
     */
    const fasterPokemon =
      pokemon1.speed >= pokemon2.speed ? pokemon1 : pokemon2;
    const slowerPokemon =
      pokemon1.speed >= pokemon2.speed ? pokemon2 : pokemon1;

    /**
     * Faster Pokemon's turn.
     */
    console.log("---------------------------------");
    console.log(
      `Turn: ${turn}, ${pokemon1.name}: ${pokemon1.currentHp} hp, ${pokemon2.name}: ${pokemon2.currentHp} hp`
    );
    outcome = handleTurn(fasterPokemon, slowerPokemon);
    if (outcome.outcome) break;
    turn++;

    /**
     * Slower Pokemon's turn.
     */
    console.log("---------------------------------");
    console.log(
      `Turn: ${turn}, ${pokemon1.name}: ${pokemon1.currentHp} hp, ${pokemon2.name}: ${pokemon2.currentHp} hp`
    );
    outcome = handleTurn(slowerPokemon, fasterPokemon);
    if (outcome.outcome) break;
    turn++;
  }

  console.log("---------------------------------");
  if (outcome.outcome === "winner") {
    console.log(
      `Outcome: ${outcome.winner?.name} won with ${outcome.winner?.currentHp} hp remaining!`
    );
  } else {
    console.log(`Outcome: draw!`);
  }

  return outcome;
};
