<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request; // 👈 Tambahan 1: Import Request
use Illuminate\Auth\AuthenticationException; // 👈 Tambahan 2: Import Exception

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
            '/*'
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // 👈 TAMBAHAN 3: Blok untuk memaksa response JSON saat gagal login/token habis
        $exceptions->renderable(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        });
    })->create(); // 👈 Pastikan selalu ditutup dengan create()

