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
 * Represents outcomes of games in which each Pokemon uses
 * a random strategy for selecting moves.
 */
@Entity()
export class RandomStrategyOutcomes extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Pokemon 1
   */
  @Index()
  @Column()
  pokemon1Name: string;

  @Column({ nullable: true })
  pokemon1Item: string;

  /**
   * Pokemon 2
   */
  @Index()
  @Column()
  pokemon2Name: string;

  @Column({ nullable: true })
  pokemon2Item: string;

  /**
   * Outcome
   */
  @Column()
  winner: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
