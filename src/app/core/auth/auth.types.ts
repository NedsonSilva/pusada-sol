import { Queue } from 'app/models/queue.types';
import { User } from '../user/user.types';

export class SignInResponse {
    token: string;
    user: User;
}
