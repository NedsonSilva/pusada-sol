import { FilterBase } from 'app/models/base/filter.base';

import { Reservation } from '../reservations/reservations.types';

export class Room {
    id: number;
    type: string;
    capacity: number;
    dailyPrice: string;
    number: string;
    description: string;
    status: 'available' | 'unavailable' | 'reserved' | 'maintenance';
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    reservations: Reservation[];
}

export class RoomPaginate {
    data: Room[];
    count: number;
    hasMore: boolean;
}

export class RoomFilter extends FilterBase {}
