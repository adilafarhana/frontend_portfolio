<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface AdminAuthInterface
{
    public function login(Request $request);

    public function logout(Request $request);

    public function me(Request $request);
}
