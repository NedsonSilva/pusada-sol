import {
    AutoIncrement,
    BelongsTo,
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


@Table
export class Reservation extends Model<Reservation> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Client)
    @Column
    clientId: number;

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

    @Column
    notes: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date

    @BelongsTo(() => Client)
    client: Client

    @BelongsTo(() => Room)
    room: Room;
}
