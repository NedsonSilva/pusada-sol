import {
    AutoIncrement,
    Column,
    CreatedAt,
    DataType,
    Default,
    DeletedAt,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { Reservation } from './Reservation';


@Table
export class Room extends Model<Room> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    type: string;

    @Column
    capacity: number;

    @Column(DataType.DECIMAL(10, 2))
    dailyPrice: string;

    @Column
    number: string;

    @Column
    description: string;

    @Default('available')
    @Column
    status: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date

    @HasMany(() => Reservation)
    reservations: Reservation[]
}
