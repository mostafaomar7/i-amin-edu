import { CoreMenu } from '@core/types';

export const adminMenu: CoreMenu[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        translate: 'MENU.DASHBOARD.COLLAPSIBLE',
        type: 'item',
        role: ['admin'],
        icon: 'home',
        url: 'dashboard'
    },
    {
        id: 'users',
        type: 'section',
        title: 'Users Management',
        translate: 'MENU.USERS.USER_MANAGEMENT',
        icon: 'package',
        children: [
            {
                id: 'admins',
                title: 'Admins Management',
                translate: 'MENU.USERS.ADMIN_MANAGEMENT',
                type: 'collapsible',
                icon: 'users',
                children: [
                    {
                        id: 'admins',
                        title: 'Admin List',
                        translate: 'MENU.USERS.ADMIN_LIST',
                        type: 'item',
                        icon: 'circle',
                        url: 'users/admins/list',
                    },
                    {
                        id: 'permissions',
                        title: 'Permissions Management',
                        translate: 'MENU.USERS.PERMISSIONS',
                        type: 'item',
                        icon: 'circle',
                        url: 'users/permissions/list',
                    },
                ]
            },
            {
                id: 'organizations',
                title: 'Organization Management',
                translate: 'MENU.USERS.ORGANIZATIONS',
                type: 'item',
                icon: 'codesandbox',
                url: 'users/organizations/list',
            },
            {
                id: 'instructors',
                title: 'Instructors Management',
                translate: 'MENU.USERS.INSTRUCTORS',
                type: 'item',
                icon: 'users',
                url: 'users/instructors/list',
            },
            {
                id: 'students',
                title: 'Students Management',
                translate: 'MENU.USERS.STUDENTS',
                type: 'item',
                icon: 'users',
                url: 'users/students/list',
            },
        ]
    },
    {
        id: 'courses',
        type: 'section',
        title: 'Courses Management',
        translate: 'MENU.COURSES.COURSES_MANAGEMENT',
        icon: 'package',
        children: [
            {
                id: 'portals',
                title: 'Educational Portal',
                translate: 'MENU.COURSES.PORTAL',
                type: 'item',
                icon: 'grid',
                url: 'apps/portals/list'
            },
            {
                id: 'stages',
                title: 'Educational Stages',
                translate: 'MENU.COURSES.STAGE',
                type: 'item',
                icon: 'git-pull-request',
                url: 'apps/stages/list'
            },
            {
                id: 'subjects',
                title: 'Subjects',
                translate: 'MENU.COURSES.SUBJECT',
                type: 'item',
                icon: 'book',
                url: 'apps/subjects/list'
            },
            {
                id: 'courses',
                title: 'Courses',
                translate: 'MENU.COURSES.COURSES',
                type: 'item',
                icon: 'book-open',
                url: 'apps/courses/list'
            },
        ]
    },
    {
        id: 'application',
        type: 'section',
        title: 'App Management',
        translate: 'MENU.APP.MANAGEMENT',
        icon: 'package',
        children: [
            {
                id: 'transactions',
                title: 'Transactions List',
                translate: 'MENU.APP.TRANSACTIONS',
                type: 'item',
                icon: 'credit-card',
                url: 'apps/transaction-history/list',
            },
            {
                id: 'notifications',
                title: 'Notification List',
                translate: 'MENU.APP.NOTIFICATIONS',
                type: 'item',
                icon: 'bell',
                url: 'apps/notifications/list',
            },
            {
                id: 'terms_and_conditions',
                title: 'Terms and Conditions',
                translate: 'MENU.APP.TERMS_AND_CONDITIONS',
                type: 'item',
                icon: 'file-text',
                url: 'apps/termsAndConditions/view/1',
            },
            {
                id: 'help_and_support',
                title: 'Help and Support',
                translate: 'MENU.APP.HELP_AND_SUPPORT',
                type: 'item',
                icon: 'life-buoy',
                url: 'apps/support/list',
            },
            // {
            //     id: 'settings',
            //     title: 'Settings',
            //     translate: 'MENU.APP.SETTINGS',
            //     type: 'item',
            //     icon: 'settings',
            //     url: 'users/5/list',
            // },
        ]
    }
];

export const instructorMenu: CoreMenu[] = [
    {
        id: 'courses',
        title: 'Courses',
        translate: 'MENU.COURSES.COURSES',
        type: 'item',
        role: ['organization'],
        icon: 'book-open',
        url: 'apps/courses/list'
    },
    // {
    //     id: 'students',
    //     title: 'Students Management',
    //     translate: 'MENU.USERS.STUDENTS',
    //     type: 'item',
    //     role: ['organization'],
    //     icon: 'users',
    //     url: 'users/students/list',
    // },
    {
        id: '6',
        title: 'Transactions List',
        translate: 'MENU.APP.TRANSACTIONS',
        type: 'item',
        role: ['organization'],
        icon: 'credit-card',
        url: 'apps/transaction-history/list',
    },
    {
        id: 'raise-support',
        title: 'Raise Support',
        translate: 'MENU.OTHERS.SUPPORT',
        icon: 'life-buoy',
        type: 'item',
        role: ['organization'],
        url: 'apps/support/list/new',
    },
    {
        id: 'Wallet Transaction',
        title: 'Wallet Transaction',
        translate: 'MENU.APP.Wallet',
        icon: 'credit-card',
        type: 'item',
        role: ['organization'],
        url: 'apps/transaction-history/wallet',
    },
    {
        id: 'Consulting Manage',
        title: 'Consulting Manage',
        translate: 'MENU.APP.Live',
        icon: 'circle',
        type: 'item',
        role: ['organization'],
        url: 'livesession',
    },
    {
        id: 'Analysis',
        title: 'Analysis',
        translate: 'MENU.APP.analysis',
        icon: 'activity',
        type: 'item',
        role: ['organization'],
        url: 'pages/auth/login',
    }
];


export const organizationMenu: CoreMenu[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        translate: 'MENU.DASHBOARD.COLLAPSIBLE',
        type: 'item',
        role: ['organization'],
        icon: 'home',
        url: 'dashboard/org'
    },
    {
        id: 'courses',
        title: 'Courses',
        translate: 'MENU.COURSES.COURSES',
        type: 'item',
        role: ['organization'],
        icon: 'book-open',
        url: 'apps/courses/list'
    },
    {
        id: 'students',
        title: 'Students Management',
        translate: 'MENU.USERS.STUDENTS',
        type: 'item',
        role: ['organization'],
        icon: 'users',
        url: 'users/students/list',
    },
    {
        id: 'instructors',
        title: 'Instructors Management',
        translate: 'MENU.USERS.INSTRUCTORS',
        type: 'item',
        role: ['organization'],
        icon: 'users',
        url: 'users/instructors/list',
    },
    {
        id: '6',
        title: 'Transactions List',
        translate: 'MENU.APP.TRANSACTIONS',
        type: 'item',
        role: ['organization'],
        icon: 'credit-card',
        url: 'apps/transaction-history/list',
    },
    {
        id: 'Consulting Manage',
        title: 'Consulting Manage',
        translate: 'MENU.APP.Live',
        icon: 'circle',
        type: 'item',
        role: ['organization'],
        url: 'livesession',
    },
    {
        id: 'Wallet Transaction',
        title: 'Wallet Transaction',
        translate: 'MENU.APP.Wallet',
        icon: 'credit-card',
        type: 'item',
        role: ['organization'],
        url: 'apps/transaction-history/wallet',
    },
    {
        id: 'raise-support',
        title: 'Raise Support',
        translate: 'MENU.OTHERS.SUPPORT',
        icon: 'life-buoy',
        type: 'item',
        role: ['organization'],
        url: 'users/33/list',
    },

];

export const StudentMenu: CoreMenu[] = [];
