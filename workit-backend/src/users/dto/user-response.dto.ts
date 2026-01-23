import { Exclude } from 'class-transformer';
import { UserProfile } from '../../profiles/entities/userprofile.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { Education } from '../../education/entities/education.entity';
import { WorkExperience } from '../../workexperience/entities/workexperience.entity';

export class UserResponseDto {
  id: number;
  email: string;
  role: 'super_admin' | 'hr' | 'candidate';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt: Date;

  @Exclude()
  passwordHash: string;

  @Exclude()
  emailVerificationToken: string | null;

  @Exclude()
  passwordResetToken: string | null;

  @Exclude()
  passwordResetExpiresAt: Date | null;

  profile?: UserProfile;
  skills?: Skill[];
  educations?: Education[];
  workExperiences?: WorkExperience[];
  applications?: any[];
}

