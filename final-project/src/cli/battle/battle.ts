import { Pokemon } from "../pokemon/types";

type BattleResult = {
  winner: Pokemon;
  loser: Pokemon;
};

export const battle = async (
  pokemon1: Pokemon,
  pokemon2: Pokemon
): Promise<BattleResult> => {
  let turn = 0;
  let fasterPokemonFinishedTurn = false;

  const fasterPokemon = pokemon1.speed >= pokemon2.speed ? pokemon1 : pokemon2;
  const slowerPokemon = pokemon1.speed >= pokemon2.speed ? pokemon2 : pokemon1;

  while (pokemon1.currentHp > 0 || pokemon2.currentHp > 0) {
    /**
     * Get which Pokemon is using a move this turn.
     */
    const currentPokemon = fasterPokemonFinishedTurn
      ? slowerPokemon
      : fasterPokemon;

    const otherPokemon = fasterPokemonFinishedTurn
      ? fasterPokemon
      : slowerPokemon;

    /**
     * Update variables after turn.
     */
    if (fasterPokemonFinishedTurn) {
      turn += 1;
      fasterPokemonFinishedTurn = false;
    } else {
      fasterPokemonFinishedTurn = true;
    }
  }

  return { winner: pokemon1, loser: pokemon2 };
};
