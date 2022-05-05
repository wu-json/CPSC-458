import { Pokemon } from "../pokemon/types";
import { checkForOutcome, handleTurn, Outcome, printHp } from "./utils";

export const battle = async (
  pokemon1: Pokemon,
  pokemon2: Pokemon
): Promise<Outcome> => {
  let turn = 0;
  let outcome: Outcome = checkForOutcome(pokemon1, pokemon2);

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
    handleTurn(fasterPokemon, slowerPokemon);
    turn++;

    printHp(pokemon1, pokemon2);
    outcome = checkForOutcome(fasterPokemon, slowerPokemon);
    if (outcome) break;

    /**
     * Slower Pokemon's turn.
     */
    console.log(`Turn: ${turn}`);
    handleTurn(slowerPokemon, fasterPokemon);
    turn++;

    printHp(pokemon1, pokemon2);
    outcome = checkForOutcome(slowerPokemon, fasterPokemon);
    if (outcome) break;
  }

  return outcome;
};
