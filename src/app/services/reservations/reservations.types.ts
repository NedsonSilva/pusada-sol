import { FilterBase } from "app/models/base/filter.base";

export class Reservation {
    id: number;
    roomId: number;
    checkinDate: Date;
    checkoutDate: Date;
    status: string;
    totalPrice: string;
    discount: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}


export class ReservationPaginate {
    data: Reservation[];
    count: number;
    hasMore: boolean;
}

export class ReservationFilter extends FilterBase {}

