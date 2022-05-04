export enum Status {
  Paralyzed = "Paralyzed",
  Poisoned = "Poisoned",
  Sleep = "Sleep",
}

export type CurrentStatus = {
  status: Status;
  turnsPassedSinceInflicted: number;
};

export enum Ability {
  PoisonHeal = "PoisonHeal",
  Gluttony = "Gluttony",
}

export enum Item {
  Leftovers = "Leftovers",
  ToxicOrb = "ToxicOrb",
}

export interface Move {
  name: string;
  currentPP: number;
  totalPP: number;
  accuracy?: number;
  /**
   * use takes a target pokemon, applies the
   * effects and returns the updated Pokemon.
   */
  use: (pokemon: Pokemon) => Pokemon;
}

export interface Pokemon {
  name: string;
  
  /**
   * Stats (fixed during battle).
   */
  totalHp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  ability: Ability;

  /**
   * Status ailments + items (may change during battle).
   */
  currentHp: number;
  status: CurrentStatus | null;
  item: Item | null;

  /**
   * Moves.
   */
  move1: Move;
  move2: Move;
  move3: Move;
  move4: Move;
}
