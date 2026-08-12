<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\AboutInterface;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    protected AboutInterface $aboutRepository;

    public function __construct(AboutInterface $aboutRepository)
    {
        $this->aboutRepository = $aboutRepository;
    }

    public function index(Request $request)
    {
        return $this->aboutRepository->getAbout($request);
    }

    public function show($id)
    {
        return $this->aboutRepository->getAboutById($id);
    }

    public function store(Request $request)
    {
        return $this->aboutRepository->createAbout($request);
    }

    public function update(Request $request, $id)
    {
        return $this->aboutRepository->updateAbout($request, $id);
    }

    public function destroy($id)
    {
        return $this->aboutRepository->deleteAbout($id);
    }
}
