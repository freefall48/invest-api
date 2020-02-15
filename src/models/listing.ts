import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export default class Listing {
  @PrimaryColumn({ type: 'text' })
  code: string;

  @Column('text')
  company: string;
}
