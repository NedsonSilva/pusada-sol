import {
    AllowNull,
    AutoIncrement,
    BeforeCreate,
    BeforeUpdate,
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
export class Client extends Model<Client> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    name: string;

    @Column
    email: string;

    @AllowNull(false)
    @Column
    phone: string;

    @AllowNull(false)
    @Column
    cpfCnpj: string;

    @Column
    gender: string

    @Column(DataType.DATEONLY)
    birthDate: Date;

    @Column
    addressZipCode: string;

    @Column
    addressCity: string;

    @Column
    addressState: string;

    @Column
    addressNeighborhood: string;

    @Column
    addressStreet: string;

    @Column
    addressNumber: string;

    @Column
    addressComplement: string;

    @Column
    status: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date

    @BeforeUpdate
    @BeforeCreate
    static hashPassword = async (instance: Client): Promise<void> => {
        if (instance?.cpfCnpj) {
            instance.cpfCnpj = instance.cpfCnpj.replace(/\D/, '');
        }
        if (instance?.phone) {
            instance.phone = instance.phone.replace(/\D/, '');
        }
    };
}
