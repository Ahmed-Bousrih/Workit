import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.educations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user: User;

  @Column({ type: 'text' })
  institution: string;

  @Column({ type: 'text' })
  degree: string;

  @Column({ name: 'fieldofstudy', type: 'text' })
  fieldOfStudy: string;

  @Column({ name: 'startyear', type: 'int' })
  startYear: number;

  @Column({ nullable: true, name: 'endyear', type: 'int' })
  endYear: number | null;

  @Column({ name: 'userid' })
  userId: number;
}
