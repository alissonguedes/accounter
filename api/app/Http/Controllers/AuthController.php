<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{

	public function login(Request $request)
	{

		$expires = 3600;
		$user    = User::where('email', $request->email)->first();

		// print_r($user->password);
		// echo '<br>';
		// print_r($request->password);
		// echo '<br>';
		// print_r(Hash::make($request->password));

		if (!$user || !Hash::check($request->password, $user->password)) {
			$dados = [
				'error'      => 'Unauthorized',
				'authorized' => false,
			];
			return response()->json($dados, 401);
		}

		$token = JWTAuth::fromUser($user);

		// Gravar o token no banco de dados para validar se o usuário precisa se logar novamente...
		$userToken = new UserToken();
		$userToken->saveToken($user, $token, strtotime('now + ' . $expires . 'seconds'));

		return response()->json([
			'authorized'   => true,
			'access_token' => $token,
			'token_type'   => 'bearer',
			'expires'      => $expires,
		]);

	}

	public function me()
	{
		return response(['message' => 'Sessão existe', 'authorized' => true], 200);
		// return response()->json(auth()->user());
	}

}
