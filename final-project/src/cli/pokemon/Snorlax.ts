import { Ability, CurrentStatus, Item, Move, Pokemon } from "./types";

export class Snorlax implements Pokemon {
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
    this.name = 'Snorlax';
    
    /**
     * Stats taken from Smogon:
     * https://www.smogon.com/dex/sm/pokemon/snorlax/battle-spot-singles/
     */
    this.totalHp = 160;
    this.attack = 110;
    this.defense = 65;
    this.spAttack = 65;
    this.spDefense = 110;
    this.speed = 30;
    this.ability = Ability.Gluttony;

    this.currentHp = this.totalHp;
    this.status = null;
    this.item = item;

    this.move1 = {
      name: "Rest",
      currentPP: 10,
      totalPP: 10,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };

    this.move2 = {
      name: "Fire Punch",
      currentPP: 15,
      totalPP: 15,
      accuracy: 100,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };

    this.move3 = {
      name: "Body Slam",
      currentPP: 15,
      totalPP: 15,
      accuracy: 100,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };

    this.move4 = {
      name: "Crunch",
      currentPP: 15,
      totalPP: 15,
      accuracy: 88,
      use: (pokemon: Pokemon) => {
        return this;
      },
    };
  }
}
