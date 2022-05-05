import { sample } from "lodash/fp";
import { Ability, Item, Pokemon, Status } from "../pokemon/types";

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

export const printHp = (pokemon1: Pokemon, pokemon2: Pokemon) => {
  console.log(
    `${pokemon1.name}: ${pokemon1.currentHp} HP, ${pokemon2.name}: ${pokemon2.currentHp}`
  );
};

export const hasAvailableMoves = (pokemon: Pokemon) =>
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

export const applyPostTurnStatusUpdates = (pokemon: Pokemon) => {
  if (!pokemon.status?.status) {
    return;
  }

  const startingHp = pokemon.currentHp;
  const isPoisoned = pokemon.status.status === Status.Poisoned;
  const hasPoisonHeal = pokemon.ability === Ability.PoisonHeal;

  if (isPoisoned && hasPoisonHeal) {
    // heal 12.5% of hp
    const healAmount = Math.round(pokemon.totalHp * 0.125);
    pokemon.currentHp = Math.min(
      pokemon.totalHp,
      pokemon.currentHp + healAmount
    );
    const hpDiff = pokemon.currentHp - startingHp;
    console.log(`${pokemon.name} healed ${hpDiff} hp from poison heal.`);
  } else if (isPoisoned) {
    const multiplier = pokemon.status.turnsPassedSinceInflicted + 1;
    const damageAmount = Math.round(pokemon.totalHp / 16) * multiplier;
    pokemon.currentHp = Math.max(0, pokemon.currentHp - damageAmount);
    const hpDiff = startingHp - pokemon.currentHp;
    console.log(`${pokemon.name} lost ${hpDiff} hp from poison.`);
  }

  pokemon.status.turnsPassedSinceInflicted++;
};

export const applyPostTurnItemUpdates = (pokemon: Pokemon) => {
  if (!pokemon.item) {
    return;
  }

  const startingHp = pokemon.currentHp;

  if (pokemon.item === Item.Leftovers) {
    const healAmount = Math.round(pokemon.totalHp / 16);
    pokemon.currentHp = Math.min(
      pokemon.totalHp,
      pokemon.currentHp + healAmount
    );
    const hpDiff = pokemon.currentHp - startingHp;
    console.log(`${pokemon.name} healed ${hpDiff} hp from leftovers.`);
  }
};

export const handleTurn = (attacker: Pokemon, defender: Pokemon): Outcome => {
  /**
   * Handle sleep and paralyzed status ailments.
   */
  const skipFromParalysisOrSleep = shouldSkipFromParalysisOrSleep(attacker);
  if (skipFromParalysisOrSleep) return {};

  /**
   * Handle move.
   */
  const availableMoves = ["move1", "move2", "move3", "move4"].filter(
    (key) => attacker[key].currentPP > 0
  );

  const selectedMoveKey = sample(availableMoves);
  const isDamagingMove = !!attacker[selectedMoveKey!].power;
  const defenderOldStatus = defender.status;

  /**
   * Handle protect case, otherwise just use the move.
   */
  if (isDamagingMove && defender.isProtected) {
    console.log(
      `${attacker.name} used ${attacker[selectedMoveKey!].name} but ${
        defender.name
      } protected itself.`
    );
  } else {
    attacker[selectedMoveKey!].use(defender);
    console.log(`${attacker.name} used ${attacker[selectedMoveKey!].name}.`);
  }

  attacker[selectedMoveKey!].currentPP--;
  defender.isProtected = false;

  if (defenderOldStatus !== defender.status && !!defender.status?.status) {
    console.log(
      `${defender.name} is now inflicted by ${defender.status.status}`
    );
  }

  let outcome: Outcome = checkForOutcome(attacker, defender);
  if (outcome.outcome) return outcome;

  /**
   * Apply post-turn events.
   */
  applyPostTurnStatusUpdates(defender);
  outcome = checkForOutcome(attacker, defender);
  if (outcome.outcome) return outcome;

  applyPostTurnItemUpdates(defender);
  outcome = checkForOutcome(attacker, defender);
  if (outcome.outcome) return outcome;

  return {};
};
