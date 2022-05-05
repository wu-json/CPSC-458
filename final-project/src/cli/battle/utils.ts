import { Pokemon, Status } from "../pokemon/types";

export const shouldSkipFromParalysisOrSleep = (pokemon: Pokemon): boolean => {
  if (pokemon.status?.status === Status.Paralyzed) {
    const skip = Math.random() >= 0.75;
    if (skip) {
      console.log(`${pokemon.name} is paralyzed and can't move.`);
      return true;
    } else {
      return false;
    }
  } else if (pokemon.status?.status === Status.Sleep) {
    const skip = Math.random() >= 0.66;
    if (skip) {
      console.log(`${pokemon.name} is fast asleep.`);
      return true;
    } else {
      pokemon.status = null;
      console.log(`${pokemon.name} woke up from sleep!`);
      return false;
    }
  } else {
    return false;
  }
};

const hasAvailableMoves = (pokemon: Pokemon) =>
  ["move1", "move2", "move3", "move4"].filter(
    (key) => pokemon[key].currentPP > 0
  ).length > 0;

export type Outcome = {
  winner?: Pokemon;
  outcome?: "draw" | "winner";
};

export const checkForOutcome = (
  pokemon1: Pokemon,
  pokemon2: Pokemon
): Outcome => {
  if (!hasAvailableMoves(pokemon1) || !hasAvailableMoves(pokemon2)) {
    return { outcome: "draw" };
  }

  if (pokemon1.currentHp === 0) {
    return { outcome: "winner", winner: pokemon2 };
  }

  if (pokemon2.currentHp === 0) {
    return { outcome: "winner", winner: pokemon1 };
  }

  return {};
};

export const handleTurn = (attacker: Pokemon, defender: Pokemon) => {
  /**
   * Handle sleep and paralyzed status ailments.
   */
  const skipFromParalysisOrSleep = shouldSkipFromParalysisOrSleep(attacker);

  /**
   * Handle move.
   */
  if (!skipFromParalysisOrSleep) {
    const availableMoves = ["move1", "move2", "move3", "move4"].filter(
      (key) => attacker[key].currentPP > 0
    );
  }
};
