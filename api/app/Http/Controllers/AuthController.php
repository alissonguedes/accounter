<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

	public function register(Request $request)
	{

		$response = [
			'statusCode' => 200,
			'status'     => 'success',
			'created'    => false,
		];

		// $expires       = 3600;
		// $validatedData = $request->validate([
		// 	'name'     => 'required', //|string|max:255',
		// 	'email'    => 'required', //|string|email|max:255|unique:users',
		// 	'password' => 'required', //|string|min:8|confirmed',
		// ]);

		// // Criação do usuário
		// $user = User::create([
		// 	'name'     => $validatedData['name'],
		// 	'email'    => $validatedData['email'],
		// 	'password' => Hash::make($validatedData['password']),
		// ]);

		// // Gerar o token JWT para o usuário recém-criado
		// $token = JWTAuth::fromUser($user);

		// // Gravar o token no banco de dados para validar se o usuário precisa se logar novamente...
		// $userToken = new UserToken();
		// $userToken->saveToken($user, $token, strtotime('now + ' . $expires . 'seconds'));

		// return response()->json([
		// 	'authorized'   => true,
		// 	'access_token' => $token,
		// 	'token_type'   => 'Bearer',
		// 	'expires'      => $expires,
		// ]);

		// return response()->json([
		// 	'user'         => $user,
		// 	'access_token' => $token,
		// ]);

		$validator = Validator::make($request->all(), [
			'name'     => 'required|string|max:255',
			'email'    => 'required|string|email|max:255|unique:users',
			'password' => 'required|string|min:6|confirmed',
		]);

		if ($validator->fails()) {
			return response()->json($validator->errors(), 422);
		}

		$user = User::create([
			'name'     => $request->name,
			'email'    => $request->email,
			'password' => Hash::make($request->password),
		]);

		$token    = $user->createToken('auth_token')->plainTextToken;
		$response = [
			'statusCode' => 401,
			'status'     => 'success',
			'created'    => true,
		];

		return response()->json($response, $response['statusCode']);
		// return response()->json([
		// 	'access_token' => $token,
		// 	'token_type'   => 'Bearer',
		// ]);
	}

	public function login(Request $request)
	{

		$response = [
			'statusCode' => 200,
			'status'     => 'success',
			'authorized' => false,
		];
		$expires = 3600;
		$user    = User::where('email', $request->email)->first();

		if (!$user) {
			$response = [
				'statusCode' => 401,
				'error'      => 'Unauthorized',
				'status'     => 'error',
				'authorized' => false,
				'message'    => 'Usuário inexistente no sistema',
			];
		} else if (!Hash::check($request->password, $user->password)) {
			$response = [
				'statusCode' => 401,
				'error'      => 'Unauthorized',
				'status'     => 'error',
				'authorized' => false,
				'message'    => 'Senha incorreta',
			];
		}

		// // if (!$user || !Hash::check($request->password, $user->password)) {
		// // 	$dados = [
		// // 		'error'      => 'Unauthorized',
		// // 		'authorized' => false,
		// // 	];
		// // 	return response()->json($dados, 401);
		// // }

		// // $token = JWTAuth::fromUser($user);

		// // // Gravar o token no banco de dados para validar se o usuário precisa se logar novamente...
		// // $userToken = new UserToken();
		// // $userToken->saveToken($user, $token, strtotime('now + ' . $expires . 'seconds'));

		// // return response()->json([
		// // 	'authorized'   => true,
		// // 	'access_token' => $token,
		// // 	'token_type'   => 'bearer',
		// // 	'expires'      => $expires,
		// // ]);

		return response()->json($response, $response['statusCode']);

	}

	public function logout(Request $request)
	{
		$request->user()->currentAccessToken()->delete();
		return response()->json(['message' => 'Successfully logged out']);
	}

	public function me()
	{
		return response(['message' => 'Sessão existe', 'authorized' => true], 200);
		// return response()->json(auth()->user());
	}

}
