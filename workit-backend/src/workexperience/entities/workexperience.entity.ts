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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.workExperiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userid' })
  user: User;

  @Column({ name: 'userid' })
  userId: number;

  @Column({ type: 'text' })
  company: string;

  @Column({ type: 'text' })
  position: string;

  @Column({ type: 'date', name: 'startdate' })
  startDate: string;

  @Column({ type: 'date', nullable: true, name: 'enddate' })
  endDate: string | null;

  @Column({ nullable: true, type: 'text' })
  description: string | null;
}
