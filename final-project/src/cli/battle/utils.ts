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

export const handleTurn = (attacker: Pokemon, defender: Pokemon) => {
  /**
   * Handle sleep and paralyzed status ailments.
   */
  const skipFromParalysisOrSleep = shouldSkipFromParalysisOrSleep(attacker);

  /**
   * Handle turn.
   */
  if (!skipFromParalysisOrSleep) {
  }
};
