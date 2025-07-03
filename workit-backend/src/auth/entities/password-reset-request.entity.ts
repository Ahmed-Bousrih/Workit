import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('passwordresetrequests')
export class PasswordResetRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;
}
