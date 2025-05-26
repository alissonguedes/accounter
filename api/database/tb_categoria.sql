-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 16/05/2025 às 19:23
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
-- Despejando dados para a tabela `tb_categoria`
--

INSERT INTO `tb_categoria` (`id`, `id_usuario`, `id_parent`, `titulo`, `titulo_slug`, `descricao`, `color`, `text_color`, `icone`, `imagem`, `ordem`, `compartilhado`, `status`, `created_at`, `updated_at`) VALUES
(24, 2, NULL, 'Receitas', 'receitas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(25, 2, NULL, 'Despesas', 'Despesas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(26, 2, 24, 'Salário', 'Salário', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(27, 2, 24, 'Renda Extra', 'Renda Extra', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(29, 2, 24, 'Premiações', 'Premiações', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(30, 2, 24, 'Reembolsos', 'reembolsos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(31, 2, 24, 'Juros / Dividendos', 'juros-dividendos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(32, 2, 24, 'Vendas', 'vendas', 'Ex.: Vendas de itens usados', NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(33, 2, 24, 'Aluguéis', 'Aluguéis', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(34, 2, 24, 'Outras receitas', 'outras-receitas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(35, 2, 25, 'Alimentação', 'Alimentação', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(36, 2, 35, 'Supermercado', 'supermercado', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(37, 2, 35, 'Restaurante / Delivery', 'restaurante-delivery', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(38, 2, 25, 'Moradia', 'moradia', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(39, 2, 38, 'Aluguel', 'aluguel', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(40, 2, 38, 'Luz / Água / Gás', 'luz-agua-gas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(41, 2, 38, 'Condomínio', 'condominio', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(42, 2, 38, 'Internet / Telefone', 'internet-telefone', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(43, 2, 25, 'Lazer', 'lazer', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(44, 2, 43, 'Cultura / Cinema / Teatro', 'cultura-cinema-teatro', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(45, 2, 43, 'Assinatura de Streams', 'assinatura-de-streams', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(46, 2, 45, 'Netflix', 'netflix', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(47, 2, 45, 'Spotify', 'spotify', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(48, 2, 45, 'Youtube', 'youtube', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(49, 2, 45, 'Amazon Prime', 'amazon-prime', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(50, 2, 25, 'Saúde', 'saude', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(51, 2, 50, 'Plano de saúde', 'plano-de-saude', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(52, 2, 50, 'Medicamentos', 'medicamentos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(53, 2, 50, 'Consultas', 'consultas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(54, 2, 25, 'Educação', 'educacao', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(55, 2, 54, 'Escola', 'escola', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(56, 2, 54, 'Faculdade', 'Faculdade', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(57, 2, 54, 'Cursos', 'cursos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(58, 2, 25, 'Compras', 'compras', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(59, 2, 58, 'Vestuário', 'vestuario', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(60, 2, 58, 'Eletrônicos', 'eletronicos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(61, 2, 58, 'Presentes', 'presentes', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(62, 2, 25, 'Cartão de crédito', 'cartao-de-credito', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(63, 2, 25, 'Impostos / Taxas', 'impostos-taxas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(64, 2, 25, 'Outras despesas', 'outras-despesas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(65, 2, 64, 'Doações', 'Doações', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(66, 2, 25, 'Pets', 'pets', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(67, 2, 25, 'Automóvel', 'automovel', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(68, 2, 67, 'Combustível', 'combustivel', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(69, 2, 67, 'Troca de óleo', 'troca-de-oleo', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(70, 2, 67, 'Pneu', 'pneu', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(71, 2, 67, 'Revisão', 'revisao', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(228, 2, 24, 'Aplicativo de recompensa', 'aplicativo-de-recompensa', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
