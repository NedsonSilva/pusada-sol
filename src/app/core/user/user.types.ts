import { FilterBase } from 'app/models/base/filter.base';

export class UserBase {
    id: string;
    name: string;
    email: string;
    profile: UserLevel;
    avatar?: string;
    status?: string;
    lastLogin?: string;
}

export enum UserLevel {
    NORMAL = 10,
    MASTER = 50,
    ADMIN = 99
}

export class User extends UserBase {}

export class UserFilter extends FilterBase {

}
