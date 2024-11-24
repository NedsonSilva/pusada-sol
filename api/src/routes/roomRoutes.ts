import { Router } from 'express';

import isAuth from '../middleware/isAuth';
import * as RoomController from '../controllers/RoomController';

export const roomRoutes = Router();

roomRoutes.get('/rooms', isAuth, RoomController.index);

roomRoutes.post('/rooms', isAuth, RoomController.store);

roomRoutes.put('/rooms/:roomId', isAuth, RoomController.update);

roomRoutes.get('/rooms/:roomId', isAuth, RoomController.show);

roomRoutes.delete('/rooms/:roomId', isAuth, RoomController.remove);
