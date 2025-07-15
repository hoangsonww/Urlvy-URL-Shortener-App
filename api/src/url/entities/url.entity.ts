import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Click } from "../../click/entities/click.entity";

@Entity()
export class Url {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  destination!: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: "text", nullable: true })
  summary?: string;

  @OneToMany(() => Click, (c) => c.url)
  clicks!: Click[];

  @CreateDateColumn()
  createdAt!: Date;
}
