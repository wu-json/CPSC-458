import { Pokemon } from "../pokemon/types";
import { handleTurn } from "./utils";

type BattleResult = {
  winner: Pokemon;
  loser: Pokemon;
};

export const battle = async (
  pokemon1: Pokemon,
  pokemon2: Pokemon
): Promise<BattleResult> => {
  let turn = 0;

  while (pokemon1.currentHp > 0 || pokemon2.currentHp > 0) {
    const fasterPokemon =
      pokemon1.speed >= pokemon2.speed ? pokemon1 : pokemon2;
    const slowerPokemon =
      pokemon1.speed >= pokemon2.speed ? pokemon2 : pokemon1;

    console.log(`Turn: ${turn}`);

    handleTurn(fasterPokemon, slowerPokemon);
    turn++;

    console.log(`Turn: ${turn}`);

    handleTurn(slowerPokemon, fasterPokemon);
    turn++;
  }

  return { winner: pokemon1, loser: pokemon2 };
};
