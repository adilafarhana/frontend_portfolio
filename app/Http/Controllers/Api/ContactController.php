<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\ContactInterface;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    protected ContactInterface $contactRepository;

    public function __construct(ContactInterface $contactRepository)
    {
        $this->contactRepository = $contactRepository;
    }

    public function index(Request $request)
    {
        return $this->contactRepository->getAllContacts($request);
    }

    public function show($id)
    {
        return $this->contactRepository->getContactById($id);
    }

    public function store(Request $request)
    {
        return $this->contactRepository->createContact($request);
    }

    public function toggleReadStatus(Request $request, $id)
    {
        return $this->contactRepository->toggleReadStatus($request, $id);
    }

    public function destroy($id)
    {
        return $this->contactRepository->deleteContact($id);
    }
}
