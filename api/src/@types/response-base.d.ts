export class ResponseBase<T> {
    data: T[];
    count: number;
    hasMore: boolean;
    perPage: number;
    page: number;
}
