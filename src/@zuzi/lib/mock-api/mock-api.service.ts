import { Injectable } from '@angular/core';
import { ZuziMockApiHandler } from '@zuzi/lib/mock-api/mock-api.request-handler';
import { ZuziMockApiMethods } from '@zuzi/lib/mock-api/mock-api.types';
import { compact, fromPairs } from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class ZuziMockApiService {
    private _handlers: { [key: string]: Map<string, ZuziMockApiHandler> } = {
        get: new Map<string, ZuziMockApiHandler>(),
        post: new Map<string, ZuziMockApiHandler>(),
        patch: new Map<string, ZuziMockApiHandler>(),
        delete: new Map<string, ZuziMockApiHandler>(),
        put: new Map<string, ZuziMockApiHandler>(),
        head: new Map<string, ZuziMockApiHandler>(),
        jsonp: new Map<string, ZuziMockApiHandler>(),
        options: new Map<string, ZuziMockApiHandler>(),
    };

    constructor() {}

    findHandler(
        method: string,
        url: string
    ): {
        handler: ZuziMockApiHandler | undefined;
        urlParams: { [key: string]: string };
    } {
        // Prepare the return object
        const matchingHandler: {
            handler: ZuziMockApiHandler | undefined;
            urlParams: { [key: string]: string };
        } = {
            handler: undefined,
            urlParams: {},
        };

        // Split the url
        const urlParts = url.split('/');

        // Get all related request handlers
        const handlers = this._handlers[method.toLowerCase()];

        // Iterate through the handlers
        handlers.forEach((handler, handlerUrl) => {
            // Skip if there is already a matching handler
            if (matchingHandler.handler) {
                return;
            }

            // Split the handler url
            const handlerUrlParts = handlerUrl.split('/');

            // Skip if the lengths of the urls we are comparing are not the same
            if (urlParts.length !== handlerUrlParts.length) {
                return;
            }

            // Compare
            const matches = handlerUrlParts.every(
                (handlerUrlPart, index) =>
                    handlerUrlPart === urlParts[index] ||
                    handlerUrlPart.startsWith(':')
            );

            // If there is a match...
            if (matches) {
                // Assign the matching handler
                matchingHandler.handler = handler;

                // Extract and assign the parameters
                matchingHandler.urlParams = fromPairs(
                    compact(
                        handlerUrlParts.map((handlerUrlPart, index) =>
                            handlerUrlPart.startsWith(':')
                                ? [handlerUrlPart.substring(1), urlParts[index]]
                                : undefined
                        )
                    )
                );
            }
        });

        return matchingHandler;
    }

    onGet(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('get', url, delay);
    }

    onPost(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('post', url, delay);
    }

    onPatch(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('patch', url, delay);
    }

    onDelete(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('delete', url, delay);
    }

    onPut(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('put', url, delay);
    }
    onHead(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('head', url, delay);
    }

    onJsonp(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('jsonp', url, delay);
    }

    onOptions(url: string, delay?: number): ZuziMockApiHandler {
        return this._registerHandler('options', url, delay);
    }

    private _registerHandler(
        method: ZuziMockApiMethods,
        url: string,
        delay?: number
    ): ZuziMockApiHandler {
        const zuziMockHttp = new ZuziMockApiHandler(url, delay);

        this._handlers[method].set(url, zuziMockHttp);

        return zuziMockHttp;
    }
}
