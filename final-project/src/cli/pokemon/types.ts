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
   * For logging purposes.
   */
  move1Name: string;
  move2Name: string;
  move3Name: string;
  move4Name: string;

  /**
   * useMoves takes a target pokemon, applies the
   * effects and returns the updated Pokemon.
   */
  useMove1: (pokemon: Pokemon) => Pokemon;
  useMove2: (pokemon: Pokemon) => Pokemon;
  useMove3: (pokemon: Pokemon) => Pokemon;
  useMove4: (pokemon: Pokemon) => Pokemon;
}
