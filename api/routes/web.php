<?php

// use App\Http\Controllers\AuthController;
// use Illuminate\Support\Facades\Request;
// use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
// 	// $secret = env('JWT_SECRET');
// 	// $client = env('JWT_CLIENT');
// 	// echo $secret.'<br>';
// 	// echo $client . '<br>';
// 	// echo '==> '. (\Hash::make($secret) !== $client) . ' <<< ' . \Hash::make($secret) . ' -> ' . $client . '<br>';
// 	// echo   ! Hash::check($secret, $client);
// 	return view('welcome');
// });

// Route::middleware(App\Http\Middleware\VerifyToken::class)->prefix('api/v2')->group(function () {

// 	Route::post('/login', [AuthController::class, 'login']);
// 	// Route::post('/login', function () {
// 	// echo Hash::make('12345');
// 	// return response(['authorized'=> true, 'token'=> Str::random(64)], 200);
// 	// });

// 	Route::middleware('auth:api')->get('/user', function (Request $request) {
// 		return $request->user();
// 	});

// });
