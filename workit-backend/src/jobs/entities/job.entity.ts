import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, name: 'description_general' })
  descriptionGeneral: string;

  @Column({ nullable: true })
  missions: string;

  @Column({ nullable: true })
  profile: string;

  @Column({ nullable: true })
  advantages: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
