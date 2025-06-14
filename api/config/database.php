<?php

use Illuminate\Support\Str;

return [

	/*
	|--------------------------------------------------------------------------
	| Default Database Connection Name
	|--------------------------------------------------------------------------
	|
	| Here you may specify which of the database connections below you wish
	| to use as your default connection for all database work. Of course
	| you may use many connections at once using the Database library.
	|
	 */

	'default'     => env('DB_CONNECTION', 'laravel'),

	/*
	|--------------------------------------------------------------------------
	| Database Connections
	|--------------------------------------------------------------------------
	|
	| Here are each of the database connections setup for your application.
	| Of course, examples of configuring each database platform that is
	| supported by Laravel is shown below to make development simple.
	|
	|
	| All database work in Laravel is done through the PHP PDO facilities
	| so make sure you have the driver for your particular database of
	| choice installed on your machine before you begin development.
	|
	 */

	'connections' => [

		'sqlite'              => [
			'driver'                  => 'sqlite',
			'url'                     => env('DATABASE_URL'),
			'database'                => env('DB_DATABASE', database_path('database.sqlite')),
			'prefix'                  => '',
			'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
		],

		'site'                => [
			'driver'         => 'mysql',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_SITE_HOST', '127.0.0.1'),
			'port'           => env('DB_SITE_PORT', '3306'),
			'database'       => env('DB_SITE_DATABASE', 'forge'),
			'username'       => env('DB_SITE_USERNAME', 'forge'),
			'password'       => env('DB_SITE_PASSWORD', ''),
			'unix_socket'    => env('DB_SITE_SOCKET', ''),
			'charset'        => 'utf8mb4',
			'collation'      => 'utf8mb4_unicode_ci',
			'prefix'         => '',
			'prefix_indexes' => true,
			'strict'         => false,
			'engine'         => null,
			'options'        => extension_loaded('pdo_mysql') ? array_filter([
				PDO::MYSQL_ATTR_SSL_CA     => env('MYSQL_ATTR_SSL_CA'),
				PDO::ATTR_EMULATE_PREPARES => true,
			]) : [],
		],

		'medicus'             => [
			'driver'         => 'mysql',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_CLINICA_HOST', '127.0.0.1'),
			'port'           => env('DB_CLINICA_PORT', '3306'),
			'database'       => env('DB_CLINICA_DATABASE', 'forge'),
			'username'       => env('DB_CLINICA_USERNAME', 'forge'),
			'password'       => env('DB_CLINICA_PASSWORD', ''),
			'unix_socket'    => env('DB_CLINICA_SOCKET', ''),
			'charset'        => 'utf8mb4',
			'collation'      => 'utf8mb4_unicode_ci',
			'prefix'         => '',
			'prefix_indexes' => true,
			'strict'         => false,
			'engine'         => null,
			'options'        => extension_loaded('pdo_mysql') ? array_filter([
				PDO::MYSQL_ATTR_SSL_CA     => env('MYSQL_ATTR_SSL_CA'),
				PDO::ATTR_EMULATE_PREPARES => true,
			]) : [],
		],

		'controle-financeiro' => [
			'driver'         => 'mysql',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_CONTROLE_FINANCEIRO_HOST', '127.0.0.1'),
			'port'           => env('DB_CONTROLE_FINANCEIRO_PORT', '3306'),
			'database'       => env('DB_CONTROLE_FINANCEIRO_DATABASE', 'forge'),
			'username'       => env('DB_CONTROLE_FINANCEIRO_USERNAME', 'forge'),
			'password'       => env('DB_CONTROLE_FINANCEIRO_PASSWORD', ''),
			'unix_socket'    => env('DB_CLINICA_SOCKET', ''),
			'charset'        => 'utf8mb4',
			'collation'      => 'utf8mb4_unicode_ci',
			'prefix'         => '',
			'prefix_indexes' => true,
			'strict'         => false,
			'engine'         => null,
			'options'        => extension_loaded('pdo_mysql') ? array_filter([
				PDO::MYSQL_ATTR_SSL_CA     => env('MYSQL_ATTR_SSL_CA'),
				PDO::ATTR_EMULATE_PREPARES => true,
			]) : [],
		],

		'system'              => [
			'driver'         => 'mysql',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_SYSTEM_HOST', '127.0.0.1'),
			'port'           => env('DB_SYSTEM_PORT', '3306'),
			'database'       => env('DB_SYSTEM_DATABASE', 'forge'),
			'username'       => env('DB_SYSTEM_USERNAME', 'forge'),
			'password'       => env('DB_SYSTEM_PASSWORD', ''),
			'unix_socket'    => env('DB_SYSTEM_SOCKET', ''),
			'charset'        => 'utf8mb4',
			'collation'      => 'utf8mb4_unicode_ci',
			'prefix'         => '',
			'prefix_indexes' => true,
			'strict'         => false,
			'engine'         => null,
			'options'        => extension_loaded('pdo_mysql') ? array_filter([
				PDO::MYSQL_ATTR_SSL_CA     => env('MYSQL_ATTR_SSL_CA'),
				PDO::ATTR_EMULATE_PREPARES => true,
			]) : [],
		],

		'tickets'             => [
			'driver'         => 'mysql',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_TICKETS_HOST', '127.0.0.1'),
			'port'           => env('DB_TICKETS_PORT', '3306'),
			'database'       => env('DB_TICKETS_DATABASE', 'forge'),
			'username'       => env('DB_TICKETS_USERNAME', 'forge'),
			'password'       => env('DB_TICKETS_PASSWORD', ''),
			'unix_socket'    => env('DB_TICKETS_SOCKET', ''),
			'charset'        => 'utf8mb4',
			'collation'      => 'utf8mb4_unicode_ci',
			'prefix'         => '',
			'prefix_indexes' => true,
			'strict'         => false,
			'engine'         => null,
			'options'        => extension_loaded('pdo_mysql') ? array_filter([
				PDO::MYSQL_ATTR_SSL_CA     => env('MYSQL_ATTR_SSL_CA'),
				PDO::ATTR_EMULATE_PREPARES => true,
			]) : [],
		],

		'laravel'             => [
			'driver'         => 'mysql',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_LARAVEL_HOST', '127.0.0.1'),
			'port'           => env('DB_LARAVEL_PORT', '3306'),
			'database'       => env('DB_LARAVEL_DATABASE', 'forge'),
			'username'       => env('DB_LARAVEL_USERNAME', 'forge'),
			'password'       => env('DB_LARAVEL_PASSWORD', ''),
			'unix_socket'    => env('DB_LARAVEL_SOCKET', ''),
			'charset'        => 'utf8mb4',
			'collation'      => 'utf8mb4_unicode_ci',
			'prefix'         => '',
			'prefix_indexes' => true,
			'strict'         => false,
			'engine'         => null,
			'options'        => extension_loaded('pdo_mysql') ? array_filter([
				PDO::MYSQL_ATTR_SSL_CA     => env('MYSQL_ATTR_SSL_CA'),
				PDO::ATTR_EMULATE_PREPARES => true,
			]) : [],
		],

		'pgsql'               => [
			'driver'         => 'pgsql',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_HOST', '127.0.0.1'),
			'port'           => env('DB_PORT', '5432'),
			'database'       => env('DB_DATABASE', 'forge'),
			'username'       => env('DB_USERNAME', 'forge'),
			'password'       => env('DB_PASSWORD', ''),
			'charset'        => 'utf8',
			'prefix'         => '',
			'prefix_indexes' => true,
			'schema'         => 'public',
			'sslmode'        => 'prefer',
		],

		'sqlsrv'              => [
			'driver'         => 'sqlsrv',
			'url'            => env('DATABASE_URL'),
			'host'           => env('DB_HOST', 'localhost'),
			'port'           => env('DB_PORT', '1433'),
			'database'       => env('DB_DATABASE', 'forge'),
			'username'       => env('DB_USERNAME', 'forge'),
			'password'       => env('DB_PASSWORD', ''),
			'charset'        => 'utf8',
			'prefix'         => '',
			'prefix_indexes' => true,
		],

	],

	/*
	|--------------------------------------------------------------------------
	| Migration Repository Table
	|--------------------------------------------------------------------------
	|
	| This table keeps track of all the migrations that have already run for
	| your application. Using this information, we can determine which of
	| the migrations on disk haven't actually been run in the database.
	|
	 */

	'migrations'  => 'migrations',

	/*
	|--------------------------------------------------------------------------
	| Redis Databases
	|--------------------------------------------------------------------------
	|
	| Redis is an open source, fast, and advanced key-value store that also
	| provides a richer body of commands than a typical key-value system
	| such as APC or Memcached. Laravel makes it easy to dig right in.
	|
	 */

	'redis'       => [

		'client'  => env('REDIS_CLIENT', 'phpredis'),

		'options' => [
			'cluster' => env('REDIS_CLUSTER', 'redis'),
			'prefix'  => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_') . '_database_'),
		],

		'default' => [
			'url'      => env('REDIS_URL'),
			'host'     => env('REDIS_HOST', '127.0.0.1'),
			'password' => env('REDIS_PASSWORD', null),
			'port'     => env('REDIS_PORT', '6379'),
			'database' => env('REDIS_DB', '0'),
		],

		'cache'   => [
			'url'      => env('REDIS_URL'),
			'host'     => env('REDIS_HOST', '127.0.0.1'),
			'password' => env('REDIS_PASSWORD', null),
			'port'     => env('REDIS_PORT', '6379'),
			'database' => env('REDIS_CACHE_DB', '1'),
		],

	],

];
