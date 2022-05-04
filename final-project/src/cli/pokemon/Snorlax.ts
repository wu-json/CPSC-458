import { Ability, CurrentStatus, Item, Pokemon } from "./types";

export class Snorlax implements Pokemon {
  public hp: number;
  public attack: number;
  public defense: number;
  public spAttack: number;
  public spDefense: number;
  public speed: number;
  public ability: Ability;

  public status: CurrentStatus | null;
  public item: Item | null;

  public move1Name: string;
  public move2Name: string;
  public move3Name: string;
  public move4Name: string;

  public constructor(item: Item | null = null) {
    /**
     * Stats taken from Smogon:
     * https://www.smogon.com/dex/sm/pokemon/snorlax/battle-spot-singles/
     */
    this.hp = 160;
    this.attack = 110;
    this.defense = 65;
    this.spAttack = 65;
    this.spDefense = 110;
    this.speed = 30;
    this.ability = Ability.Gluttony;

    this.status = null;
    this.item = item;

    this.move1Name = 'Rest';
    this.move2Name = 'Fire Punch';
    this.move3Name = 'Body Slam';
    this.move4Name = 'Crunch';
  }

  public useMove1 = (pokemon: Pokemon) => {
    return this;
  };

  public useMove2 = (pokemon: Pokemon) => {
    return this;
  };

  public useMove3 = (pokemon: Pokemon) => {
    return this;
  };

  public useMove4 = (pokemon: Pokemon) => {
    return this;
  };
}
