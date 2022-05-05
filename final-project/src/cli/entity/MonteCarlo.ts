import {
  BaseEntity,
  CreateDateColumn,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class MonteCarlo extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ unique: true })
  situation: string;

  @Column()
  pokemonName: string;

  @Column()
  move: number;

  @Column({ default: 0 })
  occurrences: number;

  @Column({ default: 0 })
  wins: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
