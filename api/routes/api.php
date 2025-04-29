<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware(App\Http\Middleware\VerifyToken::class)->prefix('v2')->group(function () {

	Route::post('/login', [AuthController::class, 'login']);
	Route::get('/status', [AuthController::class, 'me']);

	// Route::middleware(['auth:sanctum'])->group(function () {
	Route::get('/users/{id?}', function (Request $request) {

		$id        = request('id') ?? null;
		$pacientes = [
			['id' => 1, 'nome' => 'Alisson', 'cpf' => '069.422.924-51', 'rg' => '3177241', 'dataNascimento' => date('Y-m-d', strtotime('1987-01-18'))],
			['id' => 2, 'nome' => 'Chris', 'cpf' => '065.468.694-70', 'rg' => '1234', 'dataNascimento' => date('Y-m-d', strtotime('1988-01-07'))],
			['id' => 3, 'nome' => 'Benjamin', 'cpf' => '181.486.154-89', 'rg' => '58234', 'dataNascimento' => date('Y-m-d', strtotime('2022-05-06'))],
			['id' => 4, 'nome' => 'Benaia', 'cpf' => '123.456.789-10', 'rg' => '3388', 'dataNascimento' => date('Y-m-d', strtotime('2024-04-19'))],
		];

		if (!$id) {
			$pacientes = $pacientes;
		} else {
			$pacientes = array_find($pacientes, function ($i) use ($id) {
				if ($id == $i['id']) {
					return $i;
				}
			});
		}

		return response()->json($pacientes, 200);
	});
	// });

});

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::middleware(App\Http\Middleware\VerifyToken::class)->prefix('api/v2')->group(function(){
//     Route::post('/login', [AuthController::class, 'login']);
//     Route::middleware('auth:api')->get('/user', function(Request $request) {
//         return $request->user();
//     });
// });
