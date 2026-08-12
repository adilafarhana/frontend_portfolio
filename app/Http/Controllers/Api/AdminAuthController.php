<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\AdminAuthInterface;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    protected AdminAuthInterface $adminAuthRepository;

    public function __construct(AdminAuthInterface $adminAuthRepository)
    {
        $this->adminAuthRepository = $adminAuthRepository;
    }

    public function login(Request $request)
    {
        return $this->adminAuthRepository->login($request);
    }

    public function logout(Request $request)
    {
        return $this->adminAuthRepository->logout($request);
    }

    public function me(Request $request)
    {
        return $this->adminAuthRepository->me($request);
    }
}
