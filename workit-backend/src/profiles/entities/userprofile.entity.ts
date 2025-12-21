import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('userprofile')
export class UserProfile {
  @PrimaryColumn({ name: 'userid', type: 'bigint' })
  userId: number;

  @Column({ name: 'firstname' })
  firstName: string;

  @Column({ name: 'lastname' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, name: 'resumeurl' })
  resumeUrl: string | null;

  @Column({ nullable: true, name: 'aboutme' })
  aboutMe: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userid' }) // 🔥 very important to map correctly
  user: User;

  @Column({ nullable: true, name: 'photourl' })
  photoUrl: string;
}
