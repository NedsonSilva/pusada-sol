import User from '../models/User';

interface SerializedUser {
    id: number;
    name: string;
    email: string;
    profile: number;
}

export const SerializeUser = (user: User): SerializedUser => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
    };
};
