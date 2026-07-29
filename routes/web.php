<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
$router->group(['prefix' => 'api', 'middleware' => ['visitor_mode']], function () use ($router) {

    $router->get('students', 'StudentController@index');
    $router->post('students', 'StudentController@store');
    $router->get('students/{id}', 'StudentController@show');
    $router->put('students/{id}', 'StudentController@update');
    $router->delete('students/{id}', 'StudentController@destroy');
});