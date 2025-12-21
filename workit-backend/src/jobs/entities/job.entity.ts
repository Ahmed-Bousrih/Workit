import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { User } from '../../users/entities/user.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true, name: 'jobtype' })
  jobType: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'postedby' })
  postedBy: User;

  @Column({ nullable: true, name: 'postedby' })
  postedById: number;

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date;

  @Column({ default: false, name: 'isdeleted' })
  isDeleted: boolean;

  @Column({ nullable: true, name: 'deletedat' })
  deletedAt: Date;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
