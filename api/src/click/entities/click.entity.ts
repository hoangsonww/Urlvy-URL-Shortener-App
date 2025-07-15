import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Url } from "../../url/entities/url.entity";

@Entity()
export class Click {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Url, (u) => u.clicks, { onDelete: "CASCADE" })
  url!: Url;

  @Column() ip!: string;
  @Column() userAgent!: string;

  @CreateDateColumn() createdAt!: Date;
}
