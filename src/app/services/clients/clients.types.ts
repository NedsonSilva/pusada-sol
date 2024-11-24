import { FilterBase } from 'app/models/base/filter.base';

export class Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    cpfCnpj: string;
    gender: string;
    birthDate: Date;
    addressZipCode: string;
    addressCity: string;
    addressState: string;
    addressNeighborhood: string;
    addressStreet: string;
    addressNumber: string;
    addressComplement: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class ClientPaginate {
    data: Client[];
    count: number;
    hasMore: boolean;
}

export class ClientFilter extends FilterBase {}
