import { Pokemon } from "./types";

export const calculatePhysicalAttackDamage = (
  power: number,
  attacker: Pokemon,
  defender: Pokemon
): number => (12 * power * attacker.attack) / defender.defense / 50 + 2;

export const calculateSpecialAttackDamage = (
  power: number,
  attacker: Pokemon,
  defender: Pokemon
): number => (12 * power * attacker.spAttack) / defender.spDefense / 50 + 2;
