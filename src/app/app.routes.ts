import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Routes } from '@angular/router';

export const browserGuard = () => isPlatformBrowser(inject(PLATFORM_ID));

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'post/:slug',
        loadComponent: () => import('./pages/post-detail/post-detail').then(m => m.PostDetail)
    },
    {
        path: 'admin/new',
        loadComponent: () => import('./pages/editor/editor').then(m => m.EditorPage),
        canActivate: [browserGuard],
    },
    {
        path: 'admin/edit/:slug',
        loadComponent: () => import('./pages/editor/editor').then(m => m.EditorPage),
        canActivate: [browserGuard],
    },
];
