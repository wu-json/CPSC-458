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
 * Items.
 */
enum Item {
  Leftovers = "Leftovers",
  ToxicOrb = "ToxicOrb",
}

/**
 * Generic pokemon interface.
 */
export interface Pokemon {
  hp: number;
  status: CurrentStatus | null;
  item: Item | null;

  /**
   * These moves take a target pokemon, apply the
   * effects and return the updated Pokemon.
   */
  move1: (pokemon: Pokemon) => Pokemon;
  move2: (pokemon: Pokemon) => Pokemon;
  move3: (pokemon: Pokemon) => Pokemon;
  move4: (pokemon: Pokemon) => Pokemon;
}
