import { Pokemon } from "../pokemon/types";
import { checkForOutcome, handleTurn, Outcome } from "./utils";

export const battle = async (
  pokemon1: Pokemon,
  pokemon2: Pokemon
): Promise<Outcome> => {
  let turn = 0;
  let outcome: Outcome = checkForOutcome(pokemon1, pokemon2);

  while (pokemon1.currentHp > 0 || pokemon2.currentHp > 0) {
    const fasterPokemon =
      pokemon1.speed >= pokemon2.speed ? pokemon1 : pokemon2;
    const slowerPokemon =
      pokemon1.speed >= pokemon2.speed ? pokemon2 : pokemon1;

    console.log(`Turn: ${turn}`);

    handleTurn(fasterPokemon, slowerPokemon);
    turn++;

    outcome = checkForOutcome(fasterPokemon, slowerPokemon);
    if (outcome) break;

    console.log(`Turn: ${turn}`);

    handleTurn(slowerPokemon, fasterPokemon);
    turn++;

    outcome = checkForOutcome(slowerPokemon, fasterPokemon);
    if (outcome) break;
  }

  return outcome;
};
