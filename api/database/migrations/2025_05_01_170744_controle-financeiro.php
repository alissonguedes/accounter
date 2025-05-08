<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{

		// Tabela de usuários já está definida pelo próprio Laravel: `users`

		// Tabela de grupo financeiro
		Schema::create('tb_grupo_financeiro', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->string('titulo', 50);
			$table->enum('status', ['0', '1'])->default('1');
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
		});

		Schema::create('tb_grupo_financeiro_usuario', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->unsignedBigInteger('id_grupo');
			$table->enum('aceito', ['0', '1'])->default('0');
			$table->enum('status', ['0', '1'])->default('1');
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
			$table->foreign('id_grupo')->references('id')->on('tb_grupo_financeiro')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela de categorias
		Schema::create('tb_categoria', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->unsignedBigInteger('id_parent')->nullable();
			$table->string('titulo', 50);
			$table->string('titulo_slug', 100);
			$table->string('descricao', 500)->nullable();
			$table->string('color', '7')->nullable();
			$table->string('text_color', '7')->nullable();
			$table->string('icone', 255)->nullable();
			$table->string('imagem', 255)->nullable();
			$table->integer('ordem')->nullable()->default(1);
			$table->boolean('compartilhado')->default(false);
			$table->enum('status', ['0', '1'])->default('1');
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
			$table->foreign('id_parent')->references('id')->on('tb_categoria')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela de carteiras digitais
		Schema::create('tb_carteira_digital', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->integer('saldo');
			$table->string('moeda', 10)->default('BRL');
			$table->boolean('compartilhado')->default(false);
			$table->enum('status', ['ativa', 'inativa', 'suspensa'])->default('ativa');
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela para cadastro de bandeiras de cartões de crédito
		Schema::create('tb_cartao_credito_bandeira', function (Blueprint $table) {
			$table->id();
			$table->string('bandeira', 20);
			$table->timestamps();
		});

		// Tabela para cadastro de cartões de crédito
		Schema::create('tb_cartao_credito', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->unsignedBigInteger('id_bandeira');
			$table->string('digito_verificador', 4);
			$table->boolean('compartilhado')->default(false);
			$table->unsignedInteger('limite')->nullable();
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
			$table->foreign('id_bandeira')->references('id')->on('tb_cartao_credito_bandeira')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela para cadastro de aplicativos de recompensa, caso o usuário tenha algum meio de receita desse tipo: YouTube, TikTok, BlabláCar, 99, InDriver, Uber etc...
		Schema::create('tb_aplicativos', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->unsignedBigInteger('id_categoria');
			$table->string('nome', 100);
			$table->string('descricao')->nullable();
			$table->boolean('compartilhado')->default(false);
			$table->enum('status', ['0', '1'])->default('1');
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
			$table->foreign('id_categoria')->references('id')->on('tb_categoria')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela para cadastro de planejamentos e metas financeiras
		Schema::create('tb_planejamento', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->string('titulo');
			$table->integer('valor');
			$table->date('data_prevista');
			$table->string('descricao');
			$table->boolean('compartilhado')->default(false);
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela de transações
		Schema::create('tb_transacao', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->unsignedBigInteger('id_grupo');
			$table->unsignedBigInteger('id_categoria');
			$table->string('descricao', 200);
			$table->integer('valor');
			$table->enum('tipo', ['receita', 'despesa']);
			$table->date('data');
			$table->json('extras')->nullable();
			$table->boolean('compartilhado')->default(false);
			$table->timestamps();
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
			$table->foreign('id_grupo')->references('id')->on('tb_grupo_financeiro')->cascadeOnDelete()->cascadeOnUpdate();
			$table->foreign('id_categoria')->references('id')->on('tb_categoria')->cascadeOnDelete()->cascadeOnUpdate();
		});

		Schema::create('tb_planejamento_transacao', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_planejamento');
			$table->unsignedBigInteger('id_transacao');
			$table->foreign('id_planejamento')->references('id')->on('tb_planejamento')->cascadeOnDelete()->cascadeOnUpdate();
			$table->foreign('id_transacao')->references('id')->on('tb_transacao')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela para salvar configurações de projeções
		Schema::create('tb_projecao', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('id_usuario');
			$table->string('titulo', 100);
			$table->json('meses');
			$table->integer('saldo_inicial');
			$table->integer('saldo_final');
			$table->json('planejamento_ids');
			$table->json('transacao_ids');
			$table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
		});

		// Tabela de configurações

	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('tb_grupo_financeiro_usuario');
		Schema::dropIfExists('tb_grupo_financeiro');
		Schema::dropIfExists('tb_categoria');
		Schema::dropIfExists('tb_carteira_digital');
		Schema::dropIfExists('tb_cartao_credito_bandeira');
		Schema::dropIfExists('tb_cartao_credito');
		Schema::dropIfExists('tb_aplicativos');
		Schema::dropIfExists('tb_planejamento');
		Schema::dropIfExists('tb_transacao');
		Schema::dropIfExists('tb_planejamento_transacao');
		Schema::dropIfExists('tb_projecao');
	}
};
