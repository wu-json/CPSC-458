import { Ability, CurrentStatus, Item, Move, Pokemon, Status } from "./types";
import { calculatePhysicalAttackDamage } from "./utils";

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
  public isProtected: boolean;

  public move1: Move;
  public move2: Move;
  public move3: Move;
  public move4: Move;

  public constructor(item: Item | null = null) {
    this.name = "Snorlax";

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
    this.isProtected = false;

    this.move1 = {
      name: "Rest",
      currentPP: 10,
      totalPP: 10,
      use: (_pokemon: Pokemon) => {
        this.currentHp = this.totalHp;
        this.status = {
          status: Status.Sleep,
          turnsPassedSinceInflicted: 0,
        };
      },
    };

    this.move2 = {
      name: "Fire Punch",
      currentPP: 15,
      totalPP: 15,
      power: 75,
      use: (pokemon: Pokemon) => {
        const damage = calculatePhysicalAttackDamage(
          this.move2.power!,
          this,
          pokemon
        );
        pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      },
    };

    this.move3 = {
      name: "Body Slam",
      currentPP: 15,
      totalPP: 15,
      power: 50,
      use: (pokemon: Pokemon) => {
        const damage = calculatePhysicalAttackDamage(
          this.move3.power!,
          this,
          pokemon
        );
        pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      },
    };

    this.move4 = {
      name: "Crunch",
      currentPP: 15,
      totalPP: 15,
      power: 80,
      use: (pokemon: Pokemon) => {
        const damage = calculatePhysicalAttackDamage(
          this.move4.power!,
          this,
          pokemon
        );
        pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      },
    };
  }
}
