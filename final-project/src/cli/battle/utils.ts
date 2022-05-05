import colors from "colors";
import { In } from "typeorm";

import { head, orderBy, sample } from "lodash/fp";
import { Ability, Item, Pokemon, Status } from "../pokemon/types";
import { TrackedMove } from "./types";
import { MonteCarlo } from "../entity/MonteCarlo";

export const shouldSkipFromStatus = (
  pokemon: Pokemon,
  verbose: boolean = false
): boolean => {
  if (pokemon.status?.status === Status.Sleep) {
    const skip = Math.random() >= 0.66;
    if (skip) {
      verbose && console.log(`${pokemon.name} is fast asleep.`);
      return true;
    } else {
      pokemon.status = null;
      verbose && console.log(`${pokemon.name} woke up from sleep!`);
      return false;
    }
  } else {
    return false;
  }
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

export const applyPregameItemUpdates = (
  pokemon: Pokemon,
  verbose: boolean = false
) => {
  if (!pokemon.item) {
    return;
  }

  if (pokemon.item === Item.ToxicOrb) {
    pokemon.status = {
      status: Status.Poisoned,
      turnsPassedSinceInflicted: 0,
    };
    verbose && console.log(`${pokemon.name} was poisoned by the Toxic Orb.`);
  }
};

export const applyPostTurnStatusUpdates = (
  pokemon: Pokemon,
  verbose: boolean = false
) => {
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
    verbose &&
      console.log(`${pokemon.name} healed ${hpDiff} hp from poison heal.`);
  } else if (isPoisoned) {
    const multiplier = Math.min(
      15,
      pokemon.status.turnsPassedSinceInflicted + 1
    );
    const damageAmount = Math.round(pokemon.totalHp / 16) * multiplier;
    pokemon.currentHp = Math.max(0, pokemon.currentHp - damageAmount);
    const hpDiff = startingHp - pokemon.currentHp;
    verbose && console.log(`${pokemon.name} lost ${hpDiff} hp from poison.`);
  }

  pokemon.status.turnsPassedSinceInflicted++;
};

export const applyPostTurnItemUpdates = (
  pokemon: Pokemon,
  verbose: boolean = false
) => {
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
    verbose &&
      console.log(`${pokemon.name} healed ${hpDiff} hp from leftovers.`);
  }
};

/**
 * This function handles a turn, and regularly checks if an outcome state
 * has been achieved. It is also responsible for inflicting status-related
 * damage, applying item effects, and handling moves + PP management.
 */
export const handleTurn = async (
  attacker: Pokemon,
  defender: Pokemon,
  trackedMoves: TrackedMove[],
  options: {
    verbose?: boolean;
    useMonteCarloStrategy?: boolean;
  } = {}
): Promise<Outcome> => {
  const { verbose, useMonteCarloStrategy } = options;

  /**
   * Handle status ailments that result in skipping turns.
   */
  const skipFromStatus = shouldSkipFromStatus(attacker, verbose);
  if (skipFromStatus) return {};

  /**
   * Handle move.
   */
  const availableMoves = ["move1", "move2", "move3", "move4"].filter(
    (key) => attacker[key].currentPP > 0
  );

  /**
   * Situation for Monte Carlo indexing.
   */
  const situation = `${attacker.currentHp}:${defender.currentHp}:${attacker.status?.status}:${defender.status?.status}`;

  /**
   * Select a move.
   */
  let selectedMoveKey: string;
  if (useMonteCarloStrategy && attacker.name === "Gliscor") {
    const monteCarloRows = await MonteCarlo.find({
      where: {
        situation,
        pokemonName: attacker.name,
        move: In(availableMoves.map((key) => attacker[key].name)),
      },
    });

    if (monteCarloRows.length === 0) {
      selectedMoveKey = sample(availableMoves)!;
    } else {
      const hydratedMcRows = monteCarloRows.map((r) => ({
        ...r,
        winRate: r.wins / r.occurrences,
      }));

      const bestMove = head(orderBy("winRate", "desc", hydratedMcRows))!;

      verbose &&
        console.log(
          colors.magenta(
            `Monte Carlo: Best move for Gliscor here is ${
              bestMove.move
            }, with win rate of ${bestMove.winRate * 100}%`
          )
        );

      ["move1", "move2", "move3", "move4"].forEach((key) => {
        if (attacker[key].name === bestMove.move) {
          selectedMoveKey = key;
        }
      });
    }
  } else {
    selectedMoveKey = sample(availableMoves)!;
  }

  const isDamagingMove = !!attacker[selectedMoveKey!].power;
  const defenderOldStatus = defender.status;
  const defenderOldHp = defender.currentHp;
  const attackerOldHp = attacker.currentHp;

  /**
   * Track moves for Monte Carlo simulation.
   */
  trackedMoves.push({
    situation,
    moveName: attacker[selectedMoveKey!].name,
  });

  /**
   * Handle protect case, otherwise just use the move.
   */
  if (isDamagingMove && defender.isProtected) {
    verbose &&
      console.log(
        `${attacker.name} used ${attacker[selectedMoveKey!].name} but ${
          defender.name
        } protected itself.`
      );
  } else if (isDamagingMove) {
    attacker[selectedMoveKey!].use(defender);
    const hpDiff = defenderOldHp - defender.currentHp;
    verbose &&
      console.log(
        `${attacker.name} used ${
          attacker[selectedMoveKey!].name
        } and dealt ${hpDiff} hp of damage.`
      );
  } else {
    attacker[selectedMoveKey!].use(defender);
    const hpDiff = attacker.currentHp - attackerOldHp;
    if (hpDiff > 0) {
      verbose &&
        console.log(
          `${attacker.name} used ${
            attacker[selectedMoveKey!].name
          } and healed ${hpDiff} hp.`
        );
    } else {
      verbose &&
        console.log(
          `${attacker.name} used ${attacker[selectedMoveKey!].name}.`
        );
    }
  }

  attacker[selectedMoveKey!].currentPP--;
  defender.isProtected = false;

  if (defenderOldStatus !== defender.status && !!defender.status?.status) {
    verbose &&
      console.log(
        `${defender.name} is now inflicted with status: ${defender.status.status}.`
      );
  }

  let outcome: Outcome = checkForOutcome(attacker, defender);
  if (outcome.outcome) return outcome;

  /**
   * Apply post-turn events.
   */
  applyPostTurnStatusUpdates(defender, verbose);
  outcome = checkForOutcome(attacker, defender);
  if (outcome.outcome) return outcome;

  applyPostTurnItemUpdates(defender, verbose);
  outcome = checkForOutcome(attacker, defender);
  if (outcome.outcome) return outcome;

  return {};
};
