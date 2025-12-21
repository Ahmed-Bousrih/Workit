import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinTable,
  ManyToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { UserProfile } from '../../profiles/entities/userprofile.entity';
import { Education } from '../../education/entities/education.entity';
import { WorkExperience } from '../../workexperience/entities/workexperience.entity';
import { Skill } from '../../skills/entities/skill.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'passwordhash' }) // <-- maps to lowercase DB column
  passwordHash: string;

  @Column({ default: 'candidate' })
  role: 'super_admin' | 'hr' | 'candidate';

  @Column({ default: false, name: 'isemailverified' })
  isEmailVerified: boolean;

  @Column({ nullable: true, name: 'email_verification_token' })
  emailVerificationToken: string | null;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToOne(() => UserProfile, (profile) => profile.user, { eager: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  profile: UserProfile;

  @ManyToMany(() => Skill, (skill) => skill.users, { cascade: true })
  @JoinTable({
    name: 'userskills',
    joinColumn: { name: 'userid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillid', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @Column({ nullable: true, name: 'password_reset_token' })
  passwordResetToken: string | null;

  @Column({ nullable: true, name: 'password_reset_expires_at' })
  passwordResetExpiresAt: Date | null;

  @OneToMany(() => Education, (edu) => edu.user)
  educations: Education[];

  @OneToMany(() => WorkExperience, (we) => we.user)
  workExperiences: WorkExperience[];

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'lastseenat', nullable: true })
  lastSeenAt: Date;
}
