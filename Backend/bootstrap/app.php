<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        api: __DIR__ . '/../routes/api.php',

    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        // Tambahkan baris ini
        $middleware->validateCsrfTokens(except: [
            '/cart',
            '/cart/*',
            '/logout', // Sekalian kecualikan logout jika nanti diubah jadi POST lagi
            '/register', // 👈 Tambahkan ini
            '/login',   // 👈 Tambahkan ini juga biar nanti pas Sign In gak error
            '/save-bag',
            '/profile',
            '/addresses',
            '/addresses/*',
            '/roles',
            '/roles/*',
            '/admins',
            '/admins/*',
            '/profile/update-password',
            '/customers',
            '/customers/*',
        ]);
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
             'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
