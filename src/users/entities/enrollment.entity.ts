import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Curse } from 'src/curses/entities/curse.entity';
import { User } from './user.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments)
  student: User;

  @ManyToOne(() => Curse, (curse) => curse.enrollments)
  curse: Curse;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolled_at: Date;
}
