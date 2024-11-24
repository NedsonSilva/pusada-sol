import { env } from 'process';

export const isDevMode = () => env.APP_ENV === 'local';
export const isProdMode = () => env.APP_ENV === 'production';
export const getProxyUrl =() => {
    return `${env.BACKEND_URL}:${env.PROXY_PORT}`;
}
