<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

// use \Tymon\JWTAuth\Exceptions\JWTException;
// use \Tymon\JWTAuth\Facades\JWTAuth;

class VerifyToken
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{

		// try {
		//     $user = JWTAuth::parseToken()->authenticate();
		// } catch (JWTException $e){
		//     return response()-> json(['error'=> 'Token not valid'], 401);
		// }

		// return $next($request);

		$token  = $request->header('x-webhook-token');
		$secret = config('jwt.secret');

		if (!$token || !Hash::check($secret, $token)) {
			return response('Token inválido', 403);
		}

		// try {
		// 	$user = JWTAuth::parseToken()->authenticate();
		// } catch (JWTException $e) {
		// 	return response()->json(['error' => 'Token invalido'], 401);
		// }

		return $next($request);

	}
}
