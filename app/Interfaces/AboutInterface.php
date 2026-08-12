<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface AboutInterface
{
    public function getAbout(Request $request);

    public function getAboutById($id);

    public function createAbout(Request $request);

    public function updateAbout(Request $request, $id);

    public function deleteAbout($id);
}
