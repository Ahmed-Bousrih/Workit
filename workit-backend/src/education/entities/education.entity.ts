import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.educations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user: User;

  @Column()
  institution: string;

  @Column()
  degree: string;

  @Column({ name: 'fieldofstudy' })
  fieldOfStudy: string;

  @Column({ name: 'startyear' })
  startYear: number;

  @Column({ nullable: true, name: 'endyear' })
  endYear?: number;

  @Column({ name: 'userid' })
  userId: number;
}
