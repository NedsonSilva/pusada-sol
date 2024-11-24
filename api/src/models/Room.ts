import {
    AutoIncrement,
    Column,
    CreatedAt,
    DataType,
    Default,
    DeletedAt,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';


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
}
