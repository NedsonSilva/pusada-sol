import { FilterBase } from './base/filter.base';

export class Contact {
    id: string;
    name: string;
    phone: string;
    email: string;
    cpf: string;
    profilePicUrl: string;
    isGroup: boolean;
    createdAt: Date;
    updatedAt: Date;
    extraInfo: ContactCustomField[];
}

export class ContactCustomField {
    id: number;
    name: string;
    value: string;
    contactId: string;
    createdAt: Date;
    updatedAt: Date;
}


export class ContactFilter extends FilterBase {}
