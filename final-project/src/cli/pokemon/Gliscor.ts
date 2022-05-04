import { Ability, CurrentStatus, Item, Move, Pokemon } from "./types";

export class Gliscor implements Pokemon {
  public name: string;

  public totalHp: number;
  public attack: number;
  public defense: number;
  public spAttack: number;
  public spDefense: number;
  public speed: number;
  public ability: Ability;

  public currentHp: number;
  public status: CurrentStatus | null;
  public item: Item | null;

  public move1: Move;
  public move2: Move;
  public move3: Move;
  public move4: Move;

  public constructor(item: Item | null = null) {
    this.name = "Gliscor";

    /**
     * Stats taken from Smogon:
     * https://www.smogon.com/dex/sm/pokemon/gliscor/battle-spot-singles/
     */
    this.totalHp = 75;
    this.attack = 95;
    this.defense = 125;
    this.spAttack = 45;
    this.spDefense = 75;
    this.speed = 95;
    this.ability = Ability.PoisonHeal;

    this.currentHp = this.totalHp;
    this.status = null;
    this.item = item;

    this.move1 = {
      name: "Earthquake",
      currentPP: 10,
      totalPP: 10,
      accuracy: 100,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };

    this.move2 = {
      name: "Roost",
      currentPP: 14,
      totalPP: 14,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };

    this.move1 = {
      name: "Protect",
      currentPP: 10,
      totalPP: 10,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };

    this.move1 = {
      name: "Toxic",
      currentPP: 12,
      totalPP: 12,
      accuracy: 100,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };
  }
}
