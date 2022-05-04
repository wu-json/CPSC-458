import { Pokemon } from "../pokemon/types";

type BattleResult = {
  winner: Pokemon;
  loser: Pokemon;
};

export const battle = async (
  pokemon1: Pokemon,
  pokemon2: Pokemon
): Promise<BattleResult> => {
  return { winner: pokemon1, loser: pokemon2 };
};
