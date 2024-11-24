import { Router } from 'express';

import authRoutes from './authRoutes';
import userRoutes from './userRoutes';

const routes = Router();

routes.use(userRoutes);
routes.use('/auth', authRoutes);

export default routes;
