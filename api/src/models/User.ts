import { compare, hash } from 'bcryptjs';
import {
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
class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Column
    email: string;

    @Column(DataType.VIRTUAL)
    password: string;

    @Column
    passwordHash: string;

    @Column
    profile: number;

    @Column
    status: string;

    @Default(0)
    @Column
    tokenVersion: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date

    @BeforeUpdate
    @BeforeCreate
    static hashPassword = async (instance: User): Promise<void> => {
        if (instance.password) {
            instance.passwordHash = await hash(instance.password, 8);
        }
    };

    public checkPassword = async (password: string): Promise<boolean> => {
        return compare(password, this.getDataValue('passwordHash'));
    };
}

export default User;
