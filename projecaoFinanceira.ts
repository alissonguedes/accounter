/**
 * Função gerarProjecaoFinanceira
 */
interface Transacao {
	data: Date;
	tipo: 'receita' | 'despesa';
	valor: number;
	descricao?: string;
}

interface Planejamento {
	data_meta: Date;
	valor_estimado: number;
	titulo: string;
}

interface ProjecaoMensal {
	mes: string;             // ex: '2025-06'
	saldo: number;           // saldo acumulado até o mês
	variacao: number;        // quanto entrou/saiu nesse mês
}

export function gerarProjecaoFinanceira(
	saldoAtual: number,
	transacoesFuturas: Transacao[],
	planejamentos: Planejamento[],
	mesesProjecao: number = 6
): ProjecaoMensal[] {
	const hoje = new Date();
	const projecoes = new Map<string, number>();

	// Inicializa meses futuros (mesmo sem transações)
	for (let i = 0; i < mesesProjecao; i++) {
		const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
		const chave = formatMesAno(data);
		projecoes.set(chave, 0);
	}

	// Transações futuras
	for (const transacao of transacoesFuturas) {
		const chave = formatMesAno(new Date(transacao.data));
		if (!projecoes.has(chave)) continue;

		const valor = transacao.tipo === 'receita' ? transacao.valor : -transacao.valor;
		projecoes.set(chave, (projecoes.get(chave) ?? 0) + valor);
	}

	// Planejamentos (desconta como reserva futura)
	for (const plano of planejamentos) {
		const chave = formatMesAno(new Date(plano.data_meta));
		if (!projecoes.has(chave)) continue;

		projecoes.set(chave, (projecoes.get(chave) ?? 0) - plano.valor_estimado);
	}

	// Monta saldo acumulado
	const mesesOrdenados = [...projecoes.keys()].sort();
	const resultado: ProjecaoMensal[] = [];
	let saldo = saldoAtual;

	for (const mes of mesesOrdenados) {
		const variacao = projecoes.get(mes)!;
		saldo += variacao;
		resultado.push({ mes, saldo, variacao });
	}

	return resultado;
}

// Utilitário
function formatMesAno(date: Date): string {
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

/**
 * 📌 Como usar no componente ou serviço:
 */

const saldoAtual = 1500;

const transacoes: Transacao[] = [
	{ data: new Date('2025-05-15'), tipo: 'receita', valor: 1000 },
	{ data: new Date('2025-06-01'), tipo: 'despesa', valor: 500 },
];

const planejamentos: Planejamento[] = [
	{ data_meta: new Date('2025-07-01'), valor_estimado: 700, titulo: 'Curso de inglês' },
];

const projecao = gerarProjecaoFinanceira(saldoAtual, transacoes, planejamentos, 6);

console.table(projecao);
