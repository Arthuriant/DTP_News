<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use Illuminate\Routing\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function redirectToGoogle()
    {
        $redirect = request('redirect');
        if ($redirect) {
            session(['url.intended' => $redirect]);
        }
        return Socialite::driver('google')->redirect();
    }
    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->user();
        $user = User::updateOrCreate(['email' => $googleUser->getEmail()], ['name' => $googleUser->getName(), 'password' => bcrypt('google_login')]);
        Auth::login($user);
        $redirectUrl = session('url.intended', 'http://localhost:3000');
        return redirect($redirectUrl);
    }
}
