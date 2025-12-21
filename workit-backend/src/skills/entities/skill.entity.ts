import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.skills)
  users: User[];
}
