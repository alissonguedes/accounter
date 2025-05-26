-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 16/05/2025 às 19:25
-- Versão do servidor: 10.11.11-MariaDB-0ubuntu0.24.04.2
-- Versão do PHP: 8.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `controle_financeiro`
--

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'Alisson Guedes Pereira', 'alissonguedes87@gmail.com', NULL, '$2y$12$7H9TMKL8xqggyevY6Okb2u29wokykWjV18L9N0h2.z0I3EN7feDJO', NULL, '2025-05-01 23:40:53', '2025-05-01 23:40:53'),
(9, 'Alisson', 'desenvolvimentowebmin@gmail.com', NULL, '$2y$12$DW2m3SayZyerqyTUJOT1MuTZkfV59bQoBuWT2.WoMsmT9w0zuIE6e', NULL, '2025-05-12 05:20:08', '2025-05-12 05:20:08');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
