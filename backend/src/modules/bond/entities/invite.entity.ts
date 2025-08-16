import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  ownerId: string;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  acceptedBy?: string | null;
}
