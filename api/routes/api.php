<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

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

	/**
	 * Categorias
	 */
	Route::prefix('/categorias')->group(function () {

		Route::get('/{id?}', function ($id = null, $tipo = null) {

			$search        = request('search') ?? null;
			$tipo          = request('tipo') ?? null;
			$allCategorias = [];
			$getCategorias = DB::table('tb_categoria');

			if ($tipo) {
				$getCategorias = $getCategorias->whereIn('id_parent', function ($query) use ($id, $tipo) {
					$query->select('id')->from('tb_categoria')->where('titulo_slug', $tipo);
				});
			}

			$getCategorias = $getCategorias->orderBy('titulo', 'ASC');

			if ($id) {
				$categoria = $getCategorias->where('id', $id)->first();
				return [
					'id'          => $categoria->id,
					'titulo'      => $categoria->titulo,
					'titulo_slug' => $categoria->titulo_slug,
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
				$getCategorias = DB::table('tb_categoria AS C')->select(
					'id',
					'titulo',
					'titulo_slug',
					'descricao',
					'id_parent',
					'status',
					'imagem',
					'ordem',
					'icone',
					'color',
					'text_color',
					DB::raw('(SELECT titulo FROM tb_categoria AS Cat WHERE Cat.id = C.id_parent) AS tituloParent')
				)
					->where('titulo', 'like', urldecode($search) . '%')->get();
				return $getCategorias;
			}

			$categorias = $getCategorias->get();

			if ($categorias->count() > 0) {
				foreach ($categorias as $categoria) {
					$allCategorias[] = [
						'id'          => $categoria->id,
						'titulo'      => $categoria->titulo,
						'titulo_slug' => $categoria->titulo_slug,
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

		Route::post('/', function () {

			$categoria               = request()->all();
			$success                 = true;
			$message                 = 'Categoria salva com sucesso!';
			// $categoria['id_usuario'] = 2;
			$categoria['status']     = $categoria['status'] ? '1' : '0';

			$id  = DB::table('tb_categoria')->insertGetId($categoria);
			$cat = DB::table('tb_categoria')->where('id', $id)->where('id_usuario', $categoria['id_usuario'])->first();

			return response()->json(['success' => $success, 'message' => $message, 'categoria' => $cat], 201);
		});

		Route::put('/{id}', function ($id) {

			$categoria               = request()->all();
			$success                 = true;
			$message                 = 'Categoria editada com sucesso!';
			// $categoria['id_usuario'] = 2;
			$categoria['status']     = $categoria['status'] ? '1' : '0';

			DB::table('tb_categoria')->where('id', $id)->update($categoria);
			$cat = DB::table('tb_categoria')->where('id', $id)->where('id_usuario', $categoria['id_usuario'])->first();

			return response()->json(['success' => $success, 'message' => $message, 'categoria' => $cat], 200);
		});

		Route::patch('/{id}', function ($id) {

			$categoria               = request()->all();
			$success                 = true;
			$message                 = 'Categoria atualizada com sucesso!';
			// $categoria['id_usuario'] = 2;

			// DB::table('tb_categoria')->findOrFail($id);

			DB::table('tb_categoria')->where('id', $id)->update($categoria);
			$cat = DB::table('tb_categoria')->where('id', $id)->where('id_usuario', $categoria['id_usuario'])->first();

			return response()->json(['success' => $success, 'message' => $message, 'categoria' => $cat], 200);
		});

		Route::delete('/{id}', function () {
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

	/**
	 * Carteiras digitais
	 */
	Route::prefix('/carteiras-digitais')->group(function () {

		Route::get('/{id?}', function ($id = null) {

			$search       = request('search') ?? null;
			$allCarteiras = [];
			$getCarteiras = DB::table('tb_carteira_digital');

			if ($id) {
				$carteira = $getCarteiras->where('id', $id)->first();
				return [
					'id'            => $carteira->id,
					'titulo'        => $carteira->titulo,
					'titulo_slug'   => $carteira->titulo_slug,
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
						'titulo_slug'   => $carteira->titulo_slug,
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
			$success                   = true;
			$message                   = 'Carteira salva com sucesso!';
			// $carteira['id_usuario']    = 2;
			$carteira['saldo_atual']   = $carteira['saldo_atual'] * 100;
			$carteira['compartilhado'] = $carteira['compartilhado'] ? '1' : '0';

			unset($carteira['id']);

			$newCarteira = [];
			$id          = DB::table('tb_carteira_digital')->insertGetId($carteira);
			$db          = DB::table('tb_carteira_digital')->where('id', $id)->where('id_usuario', $carteira['id_usuario'])->first();
			if ($db) {

				$newCarteira = [
					'id'            => $db->id,
					'titulo'        => $db->titulo,
					'titulo_slug'   => $db->titulo_slug,
					'saldo_atual'   => $db->saldo_atual / 100,
					'compartilhado' => $db->compartilhado,
					'status'        => $db->status,
				];

			}

			return response()->json(['success' => $success, 'message' => $message, 'carteira' => $newCarteira], 201);

		});

		Route::put('/{id}', function ($id) {

			$carteira                  = request()->all();
			$success                   = true;
			$message                   = 'Carteira salva com sucesso!';
			// $carteira['id_usuario']    = 2;
			$carteira['saldo_atual']   = $carteira['saldo_atual'] * 100;
			$carteira['compartilhado'] = $carteira['compartilhado'] ? '1' : '0';

			// DB::table('tb_carteira_digital')->findOrFail($id);
			unset($carteira['id']);

			$newCarteira = [];
			DB::table('tb_carteira_digital')->where('id', $id)->update($carteira);
			$db = DB::table('tb_carteira_digital')->where('id', $id)->where('id_usuario', $carteira['id_usuario'])->first();
			if ($db) {

				$newCarteira = [
					'id'            => $db->id,
					'titulo'        => $db->titulo,
					'titulo_slug'   => $db->titulo_slug,
					'saldo_atual'   => $db->saldo_atual / 100,
					'compartilhado' => $db->compartilhado,
					'status'        => $db->status,
				];

			}
			return response()->json(['success' => $success, 'message' => $message, 'carteira' => $newCarteira], 200);

		});

		Route::patch('/{id}', function ($id) {

			$carteira               = request()->all();
			$success                = true;
			$message                = 'Carteira atualizada com sucesso!';
			// $carteira['id_usuario'] = 2;

			$newCarteira = [];
			DB::table('tb_carteira_digital')->where('id', $id)->update($carteira);
			$db = DB::table('tb_carteira_digital')->where('id', $id)->where('id_usuario', $carteira['id_usuario'])->first();

			if ($db) {
				$newCarteira = [
					'id'            => $db->id,
					'titulo'        => $db->titulo,
					'titulo_slug'   => $db->titulo_slug,
					'saldo_atual'   => $db->saldo_atual / 100,
					'compartilhado' => $db->compartilhado,
					'status'        => $db->status,
				];
			}

			return response()->json(['success' => $success, 'message' => $message, 'carteira' => $newCarteira], 200);

		});

		Route::delete('/{id}', function ($id) {

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

	/**
	 * Aplicativos
	 */
	Route::prefix('/aplicativos')->group(function () {

		Route::get('/{id?}', function ($id = null) {
			$search         = request('search') ?? null;
			$getAplicativos = DB::table('tb_aplicativos');
			if ($id) {
				return $getAplicativos->where('id', $id)->first();
			} else if ($search) {
				return $getAplicativos->where('nome', 'like', $search . '%')->get();
			}
			return $getAplicativos->get();
		});

		Route::post('/', function () {
			$aplicativo                  = request()->all();
			$success                     = true;
			$message                     = 'Aplicativo adicionado com sucesso!';
			$aplicativo['id_categoria']  = 228;
			// $aplicativo['id_usuario']    = 2;
			$aplicativo['compartilhado'] = $aplicativo['compartilhado'] ? '1' : '0';

			$novoAplicativo = [];
			$id             = DB::table('tb_aplicativos')->insertGetId($aplicativo);
			$db             = DB::table('tb_aplicativos')->where('id', $id)->where('id_usuario', $aplicativo['id_usuario'])->first();

			if ($db) {
				$novoAplicativo = [
					'id'            => $db->id,
					'nome'          => $db->nome,
					'compartilhado' => $db->compartilhado,
					'status'        => $db->status,
				];
			}

			return response()->json(['success' => $success, 'message' => $message, 'aplicativo' => $novoAplicativo], 201);

		});

		Route::put('/{id}', function ($id) {
			$aplicativo                  = request()->all();
			$success                     = true;
			$message                     = 'Aplicativo atualizado com sucesso!';
			$aplicativo['id_categoria']  = 228;
			// $aplicativo['id_usuario']    = 2;
			$aplicativo['compartilhado'] = $aplicativo['compartilhado'] ? '1' : '0';

			$novoAplicativo = [];

			DB::table('tb_aplicativos')->where('id', $id)->update($aplicativo);
			$db = DB::table('tb_aplicativos')->where('id', $id)->where('id_usuario', $aplicativo['id_usuario'])->first();

			if ($db) {
				$novoAplicativo = [
					'id'            => $db->id,
					'nome'          => $db->nome,
					'compartilhado' => $db->compartilhado,
					'status'        => $db->status,
				];
			}

			return response()->json(['success' => $success, 'message' => $message, 'aplicativo' => $novoAplicativo], 200);

		});

		Route::patch('/{id}', function ($id) {

			$aplicativo                  = request()->all();
			$success                     = true;
			$message                     = 'Aplicativo atualizado com sucesso!';
			$aplicativo['id_categoria']  = 228;
			// $aplicativo['id_usuario']    = 2;
			$aplicativo['compartilhado'] = $aplicativo['compartilhado'] ? '1' : '0';

			$novoAplicativo = [];

			DB::table('tb_aplicativos')->where('id', $id)->update($aplicativo);
			$db = DB::table('tb_aplicativos')->where('id', $id)->where('id_usuario', $aplicativo['id_usuario'])->first();

			if ($db) {
				$novoAplicativo = [
					'id'            => $db->id,
					'nome'          => $db->nome,
					'compartilhado' => $db->compartilhado,
					'status'        => $db->status,
				];
			}

			return response()->json(['success' => $success, 'message' => $message, 'aplicativo' => $novoAplicativo], 200);

		});

		Route::delete('/{id}', function ($id) {

			$carteira = DB::table('tb_aplicativos')->where('id', $id)->delete();

			if ($carteira) {
				$success = true;
				$message = 'Aplicativo removido com sucesso!';
			} else {
				$success = false;
				$message = 'Erro ao tentar remover o item [' . $id . ']!';
			}

			return response()->json(['success' => $success, 'message' => $message], 200);

		});

	});

	/**
	 * Cartões de crédito
	 */
	Route::prefix('/cartoes-credito')->group(function () {

		Route::get('/bandeiras', function () {
			return DB::table('tb_cartao_credito_bandeira')->get();
		});

		Route::get('/{id?}', function ($id = null) {

			$search     = request('search') ?? null;
			$getCartoes = DB::table('tb_cartao_credito')->select(
				'id',
				'id_usuario',
				'id_bandeira',
				DB::raw('(select bandeira from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira'),
				DB::raw('(select icone from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira_icone'),
				'titulo',
				'titulo_slug',
				'digito_verificador',
				'compartilhado',
				DB::raw('(limite / 100) as limite'),
				DB::raw('(limite_utilizado / 100) as limite_utilizado'),
				'status',
			);

			if ($id) {
				return $getCartoes->where('id', $id)->first();
			} elseif ($search) {
				return $getCartoes->where('titulo', 'like', urldecode($search) . '%')->get();
			} else {
				return $getCartoes->get();
			}

		});

		Route::post('/', function () {

			$cartao                  = request()->all();
			$success                 = true;
			$message                 = 'Cartão cadastrado com sucesso!';
			$cartao['titulo_slug']   = Str::slug($cartao['titulo']);
			// $cartao['id_usuario']    = 2;
			$cartao['limite']        = $cartao['limite'] * 100;
			$cartao['compartilhado'] = $cartao['compartilhado'] ? '1' : '0';

			$id        = DB::table('tb_cartao_credito')->insertGetId($cartao);
			$db_cartao = DB::table('tb_cartao_credito')->select('id',
				'id_usuario',
				'id_bandeira',
				DB::raw('(select bandeira from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira'),
				DB::raw('(select icone from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira_icone'),
				'titulo',
				'titulo_slug',
				'digito_verificador',
				'compartilhado',
				DB::raw('(limite / 100) as limite'),
				DB::raw('(limite_utilizado / 100) as limite_utilizado'),
				'status',
			)->where('id', $id)->first();

			return response()->json(['success' => $success, 'message' => $message, 'cartao' => $db_cartao], 201);

		});

		Route::put('/{id}', function ($id) {

			$cartao                  = request()->all();
			$success                 = true;
			$message                 = 'Cartão atualizado com sucesso!';
			$cartao['titulo_slug']   = Str::slug($cartao['titulo']);
			// $cartao['id_usuario']    = 2;
			$cartao['limite']        = $cartao['limite'] * 100;
			$cartao['compartilhado'] = $cartao['compartilhado'] ? '1' : '0';

			unset($cartao['id']);

			DB::table('tb_cartao_credito')->where('id', $id)->update($cartao);
			$db_cartao = DB::table('tb_cartao_credito')->select('id',
				'id_usuario',
				'id_bandeira',
				DB::raw('(select bandeira from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira'),
				DB::raw('(select icone from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira_icone'),
				'titulo',
				'titulo_slug',
				'digito_verificador',
				'compartilhado',
				DB::raw('(limite / 100) as limite'),
				DB::raw('(limite_utilizado / 100) as limite_utilizado'),
				'status',
			)->where('id', $id)->first();

			return response()->json(['success' => $success, 'message' => $message, 'cartao' => $db_cartao], 200);

		});

		Route::patch('/{id}', function ($id) {
			$entrada   = request()->all();
			$alterados = [];
			$success   = true;
			$message   = 'Cartão atualizado com sucesso!';

			// Recupera o registro atual do banco
			$cartaoAtual = DB::table('tb_cartao_credito')->where('id', $id)->first();

			if (!$cartaoAtual) {
				return response()->json(['success' => false, 'message' => 'Cartão não encontrado.'], 404);
			}

			// Converte o objeto em array para comparação
			$cartaoAtualArray = (array) $cartaoAtual;

			// Prepara os dados para atualizar
			// $entrada['id_usuario']  = 2;
			$entrada['titulo_slug'] = isset($entrada['titulo']) ? Str::slug($entrada['titulo']) : $cartaoAtualArray['titulo_slug'] ?? null;
			if (isset($entrada['limite'])) {
				$entrada['limite'] = $entrada['limite'] * 100;
			}
			if (isset($entrada['compartilhado'])) {
				$entrada['compartilhado'] = $entrada['compartilhado'] ? '1' : '0';
			}

			// Verifica os campos alterados
			foreach ($entrada as $campo => $novoValor) {
				if (!array_key_exists($campo, $cartaoAtualArray)) {
					continue;
				}

				$valorAtual = $cartaoAtualArray[$campo];

				// Transforma tudo em string para evitar erro de tipo na comparação
				if ((string) $valorAtual !== (string) $novoValor) {
					$alterados[$campo] = [
						'de'   => $valorAtual,
						'para' => $novoValor,
					];
				}
			}

			if (empty($alterados)) {
				return response()->json(['success' => false, 'message' => 'Nenhuma alteração detectada.'], 200);
			}

			// Atualiza apenas os campos alterados
			DB::table('tb_cartao_credito')->where('id', $id)->update($entrada);

			// Retorna o novo registro
			$db_cartao = DB::table('tb_cartao_credito')->select(
				'id',
				'id_usuario',
				'id_bandeira',
				DB::raw('(select bandeira from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira'),
				DB::raw('(select icone from tb_cartao_credito_bandeira where id = id_bandeira) as bandeira_icone'),
				'titulo',
				'titulo_slug',
				'digito_verificador',
				'compartilhado',
				DB::raw('(limite / 100) as limite'),
				DB::raw('(limite_utilizado / 100) as limite_utilizado'),
				'status',
			)->where('id', $id)->first();

			return response()->json([
				'success'   => $success,
				'message'   => $message,
				'alterados' => $alterados,
				'cartao'    => $db_cartao,
			], 200);
		});

		Route::delete('/{id}', function () {
			$id       = request('id');
			$carteira = DB::table('tb_cartao_credito')->where('id', $id)->delete();

			if ($carteira) {
				$success = true;
				$message = 'Cartão removido com sucesso!';
			} else {
				$success = false;
				$message = 'Erro ao tentar remover o item [' . $id . ']!';
			}

			return response()->json(['success' => $success, 'message' => $message], 200);
		});

	});

	/**
	 * Transações
	 */
	Route::prefix('/transactions/{transaction}')->group(function () {

		Route::get('/{id?}', function ($transaction, $id = null) {

			$search  = request()->search ?? null;
			$periodo = request()->periodo ?? null;

			$getTransaction = DB::table('tb_transacao')->select(
				'id',
				'descricao',
				'valor',
				'tipo',
				'id_categoria',
				DB::raw('DATE_FORMAT(data, "%d/%m/%Y") AS data'),
				DB::raw('(SELECT titulo FROM tb_categoria WHERE id = id_categoria) AS categoria'),
			);

			if ($periodo) {
				$getTransaction = $getTransaction->where(DB::raw('DATE_FORMAT(data, "%Y-%m")'), $periodo);
			}

			$getTransaction = $getTransaction->orderBy('data', 'asc')->orderBy('descricao', 'asc');

			if ($id) {
				return $getTransaction->where('id', $id)->first();
			} elseif ($search) {
				return $getTransaction->where('descricao', 'like', urldecode($search) . '%')->get();
			} else {
				return $getTransaction->get();
			}

		});

		Route::post('/', function () {

			$transaction = request()->all();
			// $periodo                   = request()->periodo;
			$success                   = true;
			$message                   = 'Transação salva com sucesso!';
			// $transaction['id_usuario'] = 2;
			// $transaction['status']     = $transaction['status'] ? '1' : '0';

			$id = DB::table('tb_transacao')->insertGetId($transaction);

			$cat = DB::table('tb_transacao')->select(
				'id',
				'descricao',
				'valor',
				'tipo',
				'id_categoria',
				DB::raw('DATE_FORMAT(data, "%d/%m/%Y") AS data'),
				DB::raw('(SELECT titulo FROM tb_categoria WHERE id = id_categoria) AS categoria'),
			)
				->where('id', $id)
				->where('id_usuario', $transaction['id_usuario'])
			// ->where(DB::raw('DATE_FORMAT(data, "%Y-%m")'), $periodo)
				->first();

			return response()->json(['success' => $success, 'message' => $message, 'transaction' => $cat], 201);
		});

		Route::put('/{id}', function ($transaction, $id) {

			$transaction               = request()->all();
			$success                   = true;
			$message                   = 'Transação atualizada com sucesso!';
			// $transaction['id_usuario'] = 2;
			// $transaction['compartilhado'] = $transaction['compartilhado'] ? '1' : '0';

			DB::table('tb_transacao')->where('id', $id)->update($transaction);
			$db_transacao = DB::table('tb_transacao')->select('id',
				'id',
				'descricao',
				'valor',
				'tipo',
				DB::raw('DATE_FORMAT(data, "%d/%m/%Y") AS data'),
				DB::raw('(SELECT titulo FROM tb_categoria WHERE id = id_categoria) AS categoria'),
			)->where('id', $id)->first();

			return response()->json(['success' => $success, 'message' => $message, 'transaction' => $db_transacao], 200);

		});

		Route::delete('/{id}', function () {
			$id          = request('id');
			$transaction = DB::table('tb_transacao')->where('id', $id)->delete();

			if ($transaction) {
				$success = true;
				$message = 'Transação removida com sucesso!';
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

// $request = Request::create('/api/v2/transactions/entradas/6', 'PUT', ['descricao' => 'Teste', 'valor' => 150, 'tipo' => 'receita', 'id_categoria' => 1, 'data' => '2025-06-23']);
// $request->headers->set('x-webhook-token', '$2y$12$TXHNPaAxbimjcD1S5aHaB.IbPAG/Gj46uZkfPxFVwZyTT2zWS/pzK');
// $request->headers->set('Content-Type', 'application/json');
// $request->headers->set('Accept', 'application/json');

// $response = Route::dispatch($request);
// $response->getContent();
