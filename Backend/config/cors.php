<?php

return [

    'paths' => ['login', 'api/*', 'logout', 'user', 'cart','cart/*', 'sanctum/csrf-cookie', 'auth/*', 'register', 'profile','addresses','/addresses/*','roles', 'roles/*','admins','admins/*','profile/update-password',],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://127.0.0.1:3000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
