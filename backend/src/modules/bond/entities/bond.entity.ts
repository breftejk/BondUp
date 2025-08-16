import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bonds')
export class Bond {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userAId: string;

  @Column()
  userBId: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt: Date;
}
