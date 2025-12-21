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
