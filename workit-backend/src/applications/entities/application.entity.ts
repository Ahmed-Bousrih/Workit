import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

export type ApplicationStatus = 'pending' | 'reviewed' | 'rejected';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' }) // <-- explicitly tell TypeORM the column name
  user: User;

  @ManyToOne(() => Job, (job) => job.applications, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobid' })
  job: Job | null;

  @CreateDateColumn({ name: 'appliedat' })
  appliedAt: Date;

  @Column({ default: 'pending' })
  status: ApplicationStatus;

  @Column({ default: false, name: 'isspontaneous' })
  isSpontaneous: boolean;

  @Column({ type: 'text', nullable: true })
  coverletter: string | null;
}
