import { Route } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch : 'full',
        redirectTo: 'reservas'
    },
    {
        path: 'signed-in-redirect',
        pathMatch : 'full',
        redirectTo: 'reservas'
    },
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'forgot-password',
                loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)
            },
            {
                path: 'reset-password',
                loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)
            },
            {
                path: 'entrar',
                loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)
            },
            {
                path: 'cadastrar',
                loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)
            }
        ]
    },
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'home',
                loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)
            },
        ]
    },

    // admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'example',
                loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)
            },
            {
                path: 'reservas',
                loadChildren: () => import('app/modules/admin/reservations/reservations.module').then(m => m.ReservationsModule)
            },
            {
                path: 'clientes',
                loadChildren: () => import('app/modules/admin/clients/clients.module').then(m => m.ClientsModule)
            },
            {
                path: 'quartos',
                loadChildren: () => import('app/modules/admin/rooms/rooms.module').then(m => m.RoomsModule)
            },
            {
                path: 'usuarios',
                loadChildren: () => import('app/modules/admin/users/users.module').then(m => m.UsersModule)
            },
            // {
            //     path: 'contatos',
            //     loadChildren: () => import('app/modules/admin/contacts/contacts.module').then(m => m.ContactsModule)
            // },
            // {
            //     path: 'config',
            //     children: [
            //         {
            //             path: '',
            //             pathMatch: 'full',
            //             redirectTo: 'usuarios',
            //         },
            //         {
            //             path: 'usuarios',
            //             loadChildren: () => import('app/modules/admin/users/users.module').then(m => m.UsersModule)
            //         },
            //     ]
            // }
        ]
    }
];
