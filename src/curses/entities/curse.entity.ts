import { Enrollment } from 'src/users/entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Curse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  user_id: number;

  @OneToMany(() => Enrollment, (enrollments) => enrollments.curse)
  enrollments: Enrollment[];

  @ManyToOne(() => User, (user) => user.curses)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
