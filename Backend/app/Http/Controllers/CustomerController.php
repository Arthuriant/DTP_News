<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Address;

class CustomerController extends Controller
{
    public function index()
{
    $customers = User::role('customer')
        ->with(['profile', 'addresses']) // ← tambah addresses
        ->get()
        ->map(function ($user) {
            return [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'phone'         => $user->profile?->phone,
                'date_of_birth' => $user->profile?->date_of_birth,
                'gender'        => $user->profile?->gender,
                'created_at'    => $user->created_at,
                'addresses'     => $user->addresses->map(function ($address) {
                    return [
                        'id'             => $address->id,
                        'recipient_name' => $address->recipient_name,
                        'phone_number'   => $address->phone_number,
                        'region'         => $address->region,
                        'street'         => $address->street,
                        'details'        => $address->details,
                        'label'          => $address->label,
                        'is_primary'     => $address->is_primary,
                    ];
                }),
            ];
        });

    return response()->json($customers);
}
}
