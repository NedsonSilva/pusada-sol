import { Router } from 'express';

import authRoutes from './authRoutes';
import { roomRoutes } from './roomRoutes';
import userRoutes from './userRoutes';
import { clientRoutes } from './clientRoutes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use(userRoutes);
routes.use(roomRoutes);
routes.use(clientRoutes);

export default routes;
