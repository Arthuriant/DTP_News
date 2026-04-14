<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use Illuminate\Routing\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password) // Enkripsi password
        ]);

        $user->assignRole('customer');

        Auth::login($user); // Otomatis login pakai Session

        return response()->json([
            'message' => 'Register berhasil',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            
            // Hapus session()->regenerate()
            // Generate token menggunakan Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login berhasil',
                'user' => $user,
                'token' => $token // Kirim token ke client
            ]);
        }

        return response()->json([
            'message' => 'Email atau password salah'
        ], 401);
    }

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
        if (!$user->hasRole('customer')) {
        $user->assignRole('customer');
    }
        $redirectUrl = session('url.intended', 'http://127.0.0.1:3000');
        return redirect($redirectUrl);
    }
}
