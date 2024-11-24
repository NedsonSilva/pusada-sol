import {
    AutoIncrement,
    Column,
    CreatedAt,
    DataType,
    Default,
    DeletedAt,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { Client } from './Client';
import { Room } from './Room';
import { Reservation } from './Reservation';


@Table
export class Payment extends Model<Payment> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Reservation)
    @Column
    reservationId: number;

    @ForeignKey(() => Room)
    @Column
    roomId: number;

    @Column
    checkinDate: Date;

    @Column
    checkoutDate: Date;

    @Default('pendente')
    @Column
    status: string;

    @Column(DataType.DECIMAL(10, 2))
    totalPrice: string;

    @Column(DataType.DECIMAL(10, 2))
    discount: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date
}
