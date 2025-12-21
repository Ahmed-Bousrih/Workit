import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('userprofile')
export class UserProfile {
  @PrimaryColumn({ name: 'userid', type: 'bigint' })
  userId: number;

  @Column({ name: 'firstname', type: 'text' })
  firstName: string;

  @Column({ name: 'lastname', type: 'text' })
  lastName: string;

  @Column({ nullable: true, type: 'text' })
  phone: string | null;

  @Column({ nullable: true, type: 'text' })
  address: string | null;

  @Column({ nullable: true, name: 'resumeurl', type: 'text' })
  resumeUrl: string | null;

  @Column({ nullable: true, name: 'aboutme', type: 'text' })
  aboutMe: string | null;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userid' }) // 🔥 very important to map correctly
  user: User;

  @Column({ nullable: true, name: 'photourl', type: 'text' })
  photoUrl: string | null;

  @Column({ nullable: true, name: 'birthdate', type: 'date' })
  birthDate: Date | null;

  @Column({ nullable: true, type: 'text' })
  gender: string | null;
}
