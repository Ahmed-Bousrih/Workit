import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('workexperience')
export class WorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.workExperiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userid' })
  user: User;

  @Column({ name: 'userid' }) // if you access userId directly
  userId: string;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ type: 'date', name: 'startdate' })
  startDate: string;

  @Column({ type: 'date', nullable: true, name: 'enddate' })
  endDate?: string;

  @Column({ nullable: true })
  description?: string;
}
