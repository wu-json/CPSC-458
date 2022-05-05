import { Pokemon } from "../pokemon/types";
import {
  applyPregameItemUpdates,
  checkForOutcome,
  handleTurn,
  Outcome,
  printHp,
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
    console.log(`Turn: ${turn}`);
    printHp(pokemon1, pokemon2);
    outcome = handleTurn(fasterPokemon, slowerPokemon);
    if (outcome.outcome) break;
    turn++;

    /**
     * Slower Pokemon's turn.
     */
    console.log(`Turn: ${turn}`);
    printHp(pokemon1, pokemon2);
    outcome = handleTurn(slowerPokemon, fasterPokemon);
    if (outcome.outcome) break;
    turn++;
  }

  if (outcome.outcome === "winner") {
    console.log(`Outcome: ${outcome.winner?.name} won!`);
  } else {
    console.log(`Outcome: draw!`);
  }

  return outcome;
};
