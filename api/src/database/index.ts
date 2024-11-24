import { Sequelize } from 'sequelize-typescript';

import { Client } from '../models/Client';
import User from '../models/User';
import { Room } from '../models/Room';
import { Reservation } from '../models/Reservation';
import { Payment } from '../models/Payment';

const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig);

const models = [
    User,
    Client,
    Room,
    Reservation,
    Payment
];

sequelize.addModels(models);

export default sequelize;
