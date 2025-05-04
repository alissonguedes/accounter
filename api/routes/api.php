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
		$db            = new DB('clinica');
		$allCategorias = [
			// ['id' => 1, 'titulo' => 'Categoria 1', 'descricao' => null, 'cor' => '#ff0099', 'icone' => 'dashboard', 'id_parent' => null],
			// ['id' => 2, 'titulo' => 'Categoria 2', 'descricao' => null, 'cor' => '#ff0000', 'icone' => '', 'id_parent' => 1],
			// ['id' => 3, 'titulo' => 'Categoria 3', 'descricao' => null, 'cor' => '#00ff99', 'icone' => '', 'id_parent' => 2],
			// ['id' => 4, 'titulo' => 'Categoria 4', 'descricao' => null, 'cor' => '#99ff00', 'icone' => 'place', 'id_parent' => null],
			// ['id' => 5, 'titulo' => 'Categoria 5', 'descricao' => null, 'cor' => '#ff9900', 'icone' => '', 'id_parent' => 4],
			// ['id' => 6, 'titulo' => 'Categoria 5', 'descricao' => null, 'cor' => '#9900ff', 'icone' => '', 'id_parent' => 5],
			// ['id' => 7, 'titulo' => 'Categoria 5', 'descricao' => null, 'cor' => '#0099ff', 'icone' => '', 'id_parent' => 6],
			// ['id' => 8, 'titulo' => 'Categoria 5', 'descricao' => null, 'cor' => '#0099ff', 'icone' => '', 'id_parent' => 3],
			// ['id' => 9, 'titulo' => 'Categoria 5', 'descricao' => null, 'cor' => '#0099ff', 'icone' => '', 'id_parent' => 3],
			// ['id' => 10, 'titulo' => 'Categoria 5', 'descricao' => null, 'cor' => '#0099ff', 'icone' => '', 'id_parent' => 4],
		];

		// return response($allCategorias, 200);

		$getCategorias = DB::table('tb_categoria');

		if ($id) {
			$categoria = $getCategorias->where('id', $id)->first();
			// $titulo    = DB::table('tb_categoria_descricao')->select('titulo', 'descricao')->where('id_categoria', $categoria->id)->first();
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
			$getCategorias = $getCategorias->where('id', function ($query) use ($search) {
				$query->select('id')
					->from('tb_categoria_descricao')
					->whereColumn('id', 'id_categoria')
					->where('titulo', 'like', $search . '%');
			});
		}

		$categorias = $getCategorias->get();

		if ($categorias->count() > 0) {
			foreach ($categorias as $categoria) {
				// $titulo          = DB::table('tb_categoria_descricao')->select('titulo', 'descricao')->where('id_categoria', $categoria->id)->first();
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
