import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserProfile } from '../profiles/entities/userprofile.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../workexperience/entities/workexperience.entity';
import { Application } from '../applications/entities/application.entity';
import { MailService } from '../mail/mail.service';
import { EmailTemplatesService } from '../mail/email-templates.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;
  let skillRepo: Repository<Skill>;
  let profileRepo: Repository<UserProfile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Skill),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Education),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(WorkExperience),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Application),
          useClass: Repository,
        },
        {
          provide: MailService,
          useValue: { sendMail: jest.fn() },
        },
        {
          provide: EmailTemplatesService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    skillRepo = module.get<Repository<Skill>>(getRepositoryToken(Skill));
    profileRepo = module.get<Repository<UserProfile>>(
      getRepositoryToken(UserProfile),
    );
  });

  it('should update user skills correctly', async () => {
    // Mock user
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'candidate' as const,
      isEmailVerified: true,
      skills: [],
    } as unknown as User;

    // Mock skill
    const mockSkill = {
      id: 1,
      name: 'javascript',
    } as Skill;

    // Mock repository methods
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepo, 'save').mockResolvedValue(mockUser);
    jest.spyOn(profileRepo, 'findOne').mockResolvedValue(null); // No existing profile
    jest.spyOn(profileRepo, 'create').mockReturnValue({} as UserProfile);
    jest.spyOn(profileRepo, 'save').mockResolvedValue({} as UserProfile);
    jest.spyOn(skillRepo, 'find').mockResolvedValue([mockSkill]);
    jest.spyOn(skillRepo, 'save').mockResolvedValue(mockSkill);

    // Mock the query builder
    const mockAdd = jest.fn().mockResolvedValue(undefined);
    const mockRemove = jest.fn().mockResolvedValue(undefined);
    const mockOf = jest
      .fn()
      .mockReturnValue({ add: mockAdd, remove: mockRemove });
    const mockRelation = jest.fn().mockReturnValue({ of: mockOf });
    jest.spyOn(userRepo, 'createQueryBuilder').mockReturnValue({
      relation: mockRelation,
    } as any);

    // Call updateUser with skills
    await service.updateUser(1, {
      firstName: 'Test',
      lastName: 'User',
      skills: [{ name: 'javascript' }],
    });

    // Verify the relation was updated
    expect(mockRelation).toHaveBeenCalledWith(User, 'skills');
    expect(mockOf).toHaveBeenCalledWith({ id: 1 });
    expect(mockRemove).toHaveBeenCalledWith([]);
    expect(mockAdd).toHaveBeenCalledWith([1]);
  });
});
