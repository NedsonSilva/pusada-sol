export class PaginateBase<T> {
    data: T[];
    hasMore: boolean;
    count: number;
    perPage: number;
    page: number;
}
