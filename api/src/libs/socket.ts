import { Server } from 'http';
import { verify } from 'jsonwebtoken';
import { Server as SocketIO } from 'socket.io';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';
import { logger } from '../utils/logger';

let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
    io = new SocketIO(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
        },
        perMessageDeflate: {
            threshold: 1024, // Tamanho mínimo em bytes para aplicar a compressão
            zlibDeflateOptions: {
              chunkSize: 1024,
              memLevel: 7,
              level: 3 // Nível de compressão (de 0 a 9)
            },
            zlibInflateOptions: {
              chunkSize: 10 * 1024
            },
            clientNoContextTakeover: true,
            serverNoContextTakeover: true,
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token as string;

        if (!token) {
            return next(new Error('Autenticação necessária'));
        }

        try {
            const decoded = verify(token, authConfig.secret);
            const { id, profile } = decoded as any;
            (socket as any).user = {
                id,
                profile,
            };
        } catch (err) {
            next(new Error('Autenticação inválida'));
        }

        next();
    });

    io.on('connection', (socket) => {
        logger.info('Client Connected');

        socket.on('joinChatBox', (ticketId: string, oldTicketId: string) => {
            logger.info('A client joined a ticket channel: ' + ticketId);
            socket.join(ticketId);

            if (oldTicketId) {
                logger.info('A client leaved a joinChatBox channel: ' + oldTicketId);
                socket.leave(oldTicketId);
            }
        });

        socket.on('joinNotification', () => {
            logger.info('A client joined notification channel');
            socket.join('notification');
        });

        socket.on('joinTickets', (status: string) => {
            logger.info(`A client joined to ${status} tickets channel.`);
            // console.log(socket.id, socket.rooms)
            socket.join(status)
        });

        socket.on('leaveJoinTickets', (status: string) => {
            logger.info(`A client a leaved ${status} tickets channel.`);
            socket.leave(status);
        });

        socket.on('leaveJoinChatBox', (ticketId: string) => {
            logger.info('A client leaved a joinChatBox channel');
            socket.leave(ticketId);
        });

        // socket.on('ticketMessage', (ticketId: string, message: string) => {
        //     logger.info('A client sent a message');
        //     socket.in(ticketId).emit('receiveMessage', message);
        // })

        socket.on('disconnect', () => {
            logger.info('Client disconnected');
        });
    });
    return io;
};

export const getIO = (): SocketIO => {
    if (!io) {
        throw new AppError('Socket IO not initialized');
    }
    return io;
};
