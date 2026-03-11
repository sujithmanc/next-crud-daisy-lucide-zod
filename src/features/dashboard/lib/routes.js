import { Home, User, Clapperboard, Users } from 'lucide-react';

export const ROUTES = [
    // {
    //     path: '/',
    //     label: 'Home',
    //     Icon: Home,
    //     description: 'Return to the main dashboard overview.'
    // },
    {
        path: '/demo',
        label: 'Demo',
        Icon: User, // Changed to generic User for example
        description: 'Just to check loading states'
    },
    {
        path: '/emps',
        label: 'Employee',
        Icon: User, // Changed to generic User for example
        description: 'Manage employee records and payroll.'
    },
    {
        path: '/movies',
        label: 'Movies',
        Icon: Clapperboard,
        description: 'Browse the latest movies and cinema times.'
    },
    {
        path: '/users',
        label: 'Users',
        Icon: Users,
        description: 'System administration and user roles.'
    }
];