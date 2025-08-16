import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fromUserId: string;

  @Column({ type: 'uuid', nullable: true })
  toUserId: string | null;

  @Column({ type: 'text', nullable: true })
  code: string | null;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  acceptedAt: Date | null;
}
