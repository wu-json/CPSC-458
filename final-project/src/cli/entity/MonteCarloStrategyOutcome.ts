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
 * Represents outcomes of games in which Gliscor uses
 * a Monte Carlo strategy.
 */
@Entity()
export class MonteCarloStrategyOutcome extends BaseEntity {
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
  outcome: string;

  @Column({ nullable: true })
  winner: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
