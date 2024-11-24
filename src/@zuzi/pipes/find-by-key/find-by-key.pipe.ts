import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'zuziFindByKey',
    pure: false,
})
export class ZuziFindByKeyPipe implements PipeTransform {
    constructor() {}

    transform<T extends Array<T>>(value: string | string[], key: string, source: T): any {
        if (Array.isArray(value)) {
            return value.map((item) =>
                source.find((sourceItem) => sourceItem[key] === item)
            );
        }
        return source.find((sourceItem) => sourceItem[key] === value);
    }
}
