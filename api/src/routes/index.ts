import { Router } from 'express';

import authRoutes from './authRoutes';
import { roomRoutes } from './roomRoutes';
import userRoutes from './userRoutes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use(userRoutes);
routes.use(roomRoutes);

export default routes;
