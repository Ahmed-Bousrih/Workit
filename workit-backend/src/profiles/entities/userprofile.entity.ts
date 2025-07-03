import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('userprofile')
export class UserProfile {
  @PrimaryColumn({ name: 'userid' }) // link to the correct column name
  userId: string;

  @Column({ name: 'firstname' })
  firstName: string;

  @Column({ name: 'lastname' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, name: 'resumeurl' })
  resumeUrl: string;

  @Column({ nullable: true, name: 'aboutme' })
  aboutMe: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userid' }) // 🔥 very important to map correctly
  user: User;

  @Column({ nullable: true, name: 'photourl' })
  photoUrl: string;
}
