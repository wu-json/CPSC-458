import {
  BaseEntity,
  CreateDateColumn,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Represents MonteCarlo table constructed by running a ton of
 * random simulated games.
 */
@Index(["situation", "pokemonName", "move"], { unique: true })
@Entity()
export class MonteCarlo extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  situation: string;

  @Column()
  pokemonName: string;

  @Column()
  move: string;

  @Column({ default: 0 })
  occurrences: number;

  @Column({ default: 0 })
  wins: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
