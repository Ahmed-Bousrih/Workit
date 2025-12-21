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

  @Column({ type: 'text' })
  title: string;

  @Column({ nullable: true, name: 'description_general', type: 'text' })
  descriptionGeneral: string | null;

  @Column({ nullable: true, type: 'text' })
  missions: string | null;

  @Column({ nullable: true, type: 'text' })
  profile: string | null;

  @Column({ nullable: true, type: 'text' })
  advantages: string | null;

  @Column({ nullable: true, type: 'text' })
  location: string | null;

  @Column({ nullable: true, type: 'text' })
  category: string | null;

  @Column({ nullable: true, name: 'jobtype', type: 'text' })
  jobType: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'postedby' })
  postedBy: User;

  @Column({ nullable: true, name: 'postedby' })
  postedById: number;

  @CreateDateColumn({ name: 'createdat', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat', type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: false, name: 'isdeleted', type: 'boolean' })
  isDeleted: boolean;

  @Column({ nullable: true, name: 'deletedat', type: 'timestamp' })
  deletedAt: Date | null;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
