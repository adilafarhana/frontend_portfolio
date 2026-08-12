<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface ContactInterface
{
    public function getAllContacts(Request $request);

    public function getContactById($id);

    public function createContact(Request $request);

    public function toggleReadStatus(Request $request, $id);

    public function deleteContact($id);
}
