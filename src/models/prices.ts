import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export default class Price {
  @PrimaryColumn({ type: 'timestamptz' })
  time: Date;

  @PrimaryColumn('text')
  code: string;

  @Column('money')
  price: number;
}
