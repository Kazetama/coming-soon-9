export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './lecturer'

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export interface Student {
    nim?: string
    angkatan?: number
    program_studi?: string
    status?: 'aktif' | 'lulus'
}
