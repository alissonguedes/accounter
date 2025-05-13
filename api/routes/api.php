<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware(App\Http\Middleware\VerifyToken::class)->prefix('v2')->group(function () {

	Route::post('/login', [AuthController::class, 'login']);
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::get('/mailcheck', function () {
		$email  = urldecode(request('query'));
		$existe = \App\Models\User::where('email', $email)->exists();
		return response()->json(['existe' => $existe]);
	});
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

	Route::get('/categorias', function (Request $request) {

		$id            = request('id') ?? null;
		$search        = request('search') ?? null;
		$allCategorias = [];
		$getCategorias = DB::table('tb_categoria');

		if ($id) {
			$categoria = $getCategorias->where('id', $id)->first();
			return [
				'id'          => $categoria->id,
				'titulo'      => $categoria->titulo,
				'titulo_slug' => $categoria->titulo,
				'descricao'   => $categoria->descricao ?? null,
				'id_parent'   => $categoria->id_parent,
				'status'      => $categoria->status,
				'imagem'      => $categoria->imagem ?? null,
				'ordem'       => $categoria->ordem ?? null,
				'icone'       => $categoria->icone,
				'color'       => $categoria->color ?? null,
				'text_color'  => $categoria->text_color ?? null,
			];
		} else if ($search) {
			$getCategorias = DB::table('tb_categoria AS C')->select('titulo',
				'id',
				'titulo_slug',
				'descricao',
				'id_parent',
				'status',
				'imagem',
				'ordem',
				'icone',
				'color',
				'text_color',
				DB::raw('(SELECT titulo FROM tb_categoria AS Cat WHERE Cat.id = C.id_parent) AS tituloParent'))->where('titulo', 'like', urldecode($search) . '%')->get();
			return $getCategorias;
		}

		$categorias = $getCategorias->get();

		if ($categorias->count() > 0) {
			foreach ($categorias as $categoria) {
				$allCategorias[] = [
					'id'          => $categoria->id,
					'titulo'      => $categoria->titulo,
					'titulo_slug' => $categoria->titulo,
					// 'descricao'   => $categoria->descricao,
					'id_parent'   => $categoria->id_parent,
					'status'      => $categoria->status,
					'ordem'       => $categoria->ordem,
					'icone'       => $categoria->icone,
					// 'color'       => $categoria->color,
					// 'text_color'  => $categoria->text_color,
				];
			}
		}

		return response()->json($allCategorias, 200);

	});

	Route::post('/categorias', function (Request $request) {

		$categoria               = request()->all();
		$id                      = $categoria['id'] ?? null;
		$success                 = true;
		$message                 = 'Categoria salva com sucesso!';
		$categoria['id_usuario'] = 2;
		$categoria['status']     = $categoria['status'] ? '1' : '0';

		unset($categoria['id']);

		DB::table('tb_categoria')->insert($categoria);
		$cat = DB::table('tb_categoria')->where('id_usuario', $categoria['id_usuario'])->get();

		return response()->json(['success' => $success, 'message' => $message, 'categorias' => $cat], 200);
	});

	Route::put('/categorias', function (Request $request) {

		$categoria               = request()->all();
		$id                      = $categoria['id'] ?? null;
		$success                 = true;
		$message                 = 'Categoria editada com sucesso!';
		$categoria['id_usuario'] = 2;
		$categoria['status']     = $categoria['status'] ? '1' : '0';

		unset($categoria['id']);

		DB::table('tb_categoria')->where('id', $id)->update($categoria);
		$cat = DB::table('tb_categoria')->where('id_usuario', $categoria['id_usuario'])->get();

		return response()->json(['success' => $success, 'message' => $message, 'categorias' => $cat], 200);
	});

	Route::patch('/categorias/{id}', function (Request $request) {

		$categoria               = request()->all();
		$id                      = request('id');
		$success                 = true;
		$message                 = 'Categoria atualizada com sucesso!';
		$categoria['id_usuario'] = 2;

		DB::table('tb_categoria')->where('id', $id)->update($categoria);

		return response()->json(['success' => $success, 'message' => $message], 200);
	});

	Route::delete('/categorias/{id}', function () {
		$id        = request('id');
		$categoria = DB::table('tb_categoria')->where('id', $id)->delete();

		if ($categoria) {
			$success = true;
			$message = 'Item [' . $id . '] removido com sucesso!';
		} else {
			$success = false;
			$message = 'Erro ao tentar remover o item [' . $id . ']!';
		}

		return response()->json(['success' => $success, 'message' => $message], 200);
	});

	Route::prefix('/carteiras-digitais')->group(function () {

		Route::get('/', function () {

			// $id            = request('id') ?? null;
			// $search        = request('search') ?? null;
			// $allCategorias = [];

			// $allCarteiras = DB::table('tb_carteira_digital')->get();
			// return response()->json($allCarteiras, 200);

			$id           = request('id') ?? null;
			$search       = request('search') ?? null;
			$allCarteiras = [];
			$getCarteiras = DB::table('tb_carteira_digital');

			if ($id) {
				$carteira = $getCarteiras->where('id', $id)->first();
				return [
					'id'            => $carteira->id,
					'titulo'        => $carteira->titulo,
					'titulo_slug'   => $carteira->titulo,
					// 'descricao'   => $carteira->descricao ?? null,
					// 'id_parent'   => $carteira->id_parent,
					'saldo_atual'   => $carteira->saldo_atual / 100,
					'compartilhado' => $carteira->compartilhado,
					'status'        => $carteira->status,
					// 'imagem'      => $carteira->imagem ?? null,
					// 'ordem'       => $carteira->ordem ?? null,
					// 'icone'       => $carteira->icone,
					// 'color'       => $carteira->color ?? null,
					// 'text_color'  => $carteira->text_color ?? null,
				];
			} else if ($search) {
				$getCarteiras = DB::table('tb_carteira_digital AS C')->select('titulo',
					'id',
					'titulo',
					'titulo_slug',
					// 'descricao',
					// 'id_parent',
					'saldo_atual',
					'compartilhado',
					'status',
					// 'imagem',
					// 'ordem',
					// 'icone',
					// 'color',
					// 'text_color',
				)->where('titulo', 'like', urldecode($search) . '%')->get();
				return $getCarteiras;
			}

			$carteiras = $getCarteiras->get();

			if ($carteiras->count() > 0) {

				foreach ($carteiras as $carteira) {

					$allCarteiras[] = [
						'id'            => $carteira->id,
						'titulo'        => $carteira->titulo,
						'titulo_slug'   => $carteira->titulo,
						'saldo_atual'   => $carteira->saldo_atual / 100,
						// 'descricao'   => $carteira->descricao,
						// 'id_parent'   => $carteira->id_parent,
						'compartilhado' => $carteira->compartilhado,
						'status'        => $carteira->status,
						// 'ordem'       => $carteira->ordem,
						// 'icone'       => $carteira->icone,
						// 'color'       => $carteira->color,
						// 'text_color'  => $carteira->text_color,
					];

				}

			}

			return response()->json($allCarteiras, 200);

		});

		Route::post('/', function () {

			$carteira                  = request()->all();
			$id                        = $carteira['id'] ?? null;
			$success                   = true;
			$message                   = 'Carteira salva com sucesso!';
			$carteira['id_usuario']    = 2;
			$carteira['saldo_atual']   = $carteira['saldo_atual'] * 100;
			$carteira['compartilhado'] = $carteira['compartilhado'] ? '1' : '0';

			unset($carteira['id']);

			DB::table('tb_carteira_digital')->insert($carteira);
			$carteiras = [];
			$db        = DB::table('tb_carteira_digital')->where('id_usuario', $carteira['id_usuario'])->get();
			if ($db->count() > 0) {

				foreach ($db as $carteira) {

					$carteiras[] = [
						'id'            => $carteira->id,
						'titulo'        => $carteira->titulo,
						'titulo_slug'   => $carteira->titulo,
						'saldo_atual'   => $carteira->saldo_atual / 100,
						'compartilhado' => $carteira->compartilhado,
						'status'        => $carteira->status,
					];

				}

			}
			return response()->json(['success' => $success, 'message' => $message, 'carteiras' => $carteiras], 200);

		});

		Route::put('/', function () {

			$carteira                  = request()->all();
			$id                        = $carteira['id'] ?? null;
			$success                   = true;
			$message                   = 'Carteira salva com sucesso!';
			$carteira['id_usuario']    = 2;
			$carteira['saldo_atual']   = $carteira['saldo_atual'] * 100;
			$carteira['compartilhado'] = $carteira['compartilhado'] ? '1' : '0';

			unset($carteira['id']);

			DB::table('tb_carteira_digital')->where('id', $id)->update($carteira);
			$carteiras = [];
			$db        = DB::table('tb_carteira_digital')->where('id_usuario', $carteira['id_usuario'])->get();
			if ($db->count() > 0) {

				foreach ($db as $carteira) {

					$carteiras[] = [
						'id'            => $carteira->id,
						'titulo'        => $carteira->titulo,
						'titulo_slug'   => $carteira->titulo,
						'saldo_atual'   => $carteira->saldo_atual / 100,
						'compartilhado' => $carteira->compartilhado,
						'status'        => $carteira->status,
					];

				}

			}
			return response()->json(['success' => $success, 'message' => $message, 'carteiras' => $carteiras], 200);

		});

		Route::patch('/{id}', function (Request $request) {

			$carteira               = request()->all();
			$id                     = request('id');
			$success                = true;
			$message                = 'Carteira atualizada com sucesso!';
			$carteira['id_usuario'] = 2;

			DB::table('tb_carteira_digital')->where('id', $id)->update($carteira);

			return response()->json(['success' => $success, 'message' => $message], 200);
		});

		Route::delete('/{id}', function () {
			$id       = request('id');
			$carteira = DB::table('tb_carteira_digital')->where('id', $id)->delete();

			if ($carteira) {
				$success = true;
				$message = 'Carteira removida com sucesso!';
			} else {
				$success = false;
				$message = 'Erro ao tentar remover o item [' . $id . ']!';
			}

			return response()->json(['success' => $success, 'message' => $message], 200);
		});

	});

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
