/* tslint:disable:max-line-length */
import { ZuziNavItem } from '@zuzi/components/navigation';

export const defaultNavigation: ZuziNavItem[] = [
    // {
    //     id   : 'dashboard',
    //     title: 'Dashboard',
    //     type : 'basic',
    //     icon : 'mat_solid:dashboard',
    //     link : '/dashboard',
    // },
    {
        id   : 'reservations',
        title: 'Reservas',
        type : 'basic',
        icon : 'mat_outline:event_note',
        link : '/reservas'
    },
    {
        id   : 'clients',
        title: 'Clientes',
        type : 'basic',
        icon : 'mat_outline:group',
        link : '/clientes'
    },
    {
        id   : 'rooms',
        title: 'Quartos',
        type : 'basic',
        icon : 'mat_outline:hotel',
        link : '/quartos'
    },
    {
        id: 'master-group',
        title: 'Adminstração',
        type: 'group',
        children: [
            {
                id: 'team',
                title: 'Usuários',
                type: 'basic',
                icon: 'feather:users',
                link: '/usuarios',
            },
            // {
            //     id: 'configurations',
            //     title: 'Configurações',
            //     type: 'basic',
            //     icon: 'mat_outline:settings'
            // },
        ]
    }
];
export const compactNavigation: ZuziNavItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: ZuziNavItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: ZuziNavItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
