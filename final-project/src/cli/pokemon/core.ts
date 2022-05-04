/**
 * Status types.
 */
enum Status {
  Paralyzed = "Paralyzed",
  Poisoned = "Poisoned",
  Sleep = "Sleep",
}

type CurrentStatus = {
  status: Status;
  turnsPassedSinceInflicted: number;
};

/**
 * Generic pokemon interface.
 */
export interface Pokemon {
  hp: number;
  status: CurrentStatus;

  /**
   * These moves take a target pokemon, apply the
   * effects and return the updated Pokemon.
   */
  move1: (pokemon: Pokemon) => Pokemon;
  move2: (pokemon: Pokemon) => Pokemon;
  move3: (pokemon: Pokemon) => Pokemon;
  move4: (pokemon: Pokemon) => Pokemon;
}
