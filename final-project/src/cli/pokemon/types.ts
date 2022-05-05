export enum Status {
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
  power?: number;
  /**
   * use takes a target pokemon and applies the effects/damage
   */
  use: (pokemon: Pokemon) => void;
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
  isProtected: boolean;

  /**
   * Moves.
   */
  move1: Move;
  move2: Move;
  move3: Move;
  move4: Move;
}
