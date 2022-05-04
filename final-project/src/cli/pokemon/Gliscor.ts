import { CurrentStatus, Item, Pokemon } from "./types";

export class Gliscor implements Pokemon {
  public hp: number;
  public attack: number;
  public defense: number;
  public spAttack: number;
  public spDefense: number;
  public speed: number;

  public status: CurrentStatus | null;
  public item: Item | null;

  public move1Name: string;
  public move2Name: string;
  public move3Name: string;
  public move4Name: string;

  public constructor(item: Item | null = null) {
    this.hp = 75;
    this.attack = 95;
    this.defense = 125;
    this.spAttack = 45;
    this.spDefense = 75;
    this.speed = 95;

    this.status = null;
    this.item = item;
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
