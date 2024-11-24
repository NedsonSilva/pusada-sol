import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Ticket } from 'app/layout/common/quick-chat/quick-chat.types';

@Injectable({
    providedIn: 'root'
})
export class QuickChatService
{
    private _chat: BehaviorSubject<Ticket> = new BehaviorSubject(null);
    private _chats: BehaviorSubject<Ticket[]> = new BehaviorSubject<Ticket[]>(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for chat
     */
    get chat$(): Observable<Ticket>
    {
        return this._chat.asObservable();
    }

    /**
     * Getter for chat
     */
    get chats$(): Observable<Ticket[]>
    {
        return this._chats.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get chats
     */
    getChats(): Observable<any>
    {
        return this._httpClient.get<Ticket[]>('api/apps/chat/chats').pipe(
            tap((response: Ticket[]) => {
                this._chats.next(response);
            })
        );
    }

    /**
     * Get chat
     *
     * @param id
     */
    getChatById(id: string): Observable<any>
    {
        return this._httpClient.get<Ticket>('api/apps/chat/chat', {params: {id}}).pipe(
            map((chat) => {

                // Update the chat
                this._chat.next(chat);

                // Return the chat
                return chat;
            }),
            switchMap((chat) => {

                if ( !chat )
                {
                    return throwError('Could not found chat with id of ' + id + '!');
                }

                return of(chat);
            })
        );
    }
}
