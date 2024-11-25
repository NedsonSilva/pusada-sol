import { Router } from 'express';

import isAuth from '../middleware/isAuth';
import * as ClientController from '../controllers/ClientController';

export const clientRoutes = Router();

clientRoutes.get('/clients', isAuth, ClientController.index);

clientRoutes.post('/clients', isAuth, ClientController.store);

clientRoutes.put('/clients/:clientId', isAuth, ClientController.update);

clientRoutes.get('/clients/:clientId', isAuth, ClientController.show);

clientRoutes.delete('/clients/:clientId', isAuth, ClientController.remove);
