import type { BarPoint, MetricSummary, Period, PiePoint, TransactionRow } from '$lib/types';

export function toNumber(value: number | string | null | undefined) {
	return Number(value ?? 0);
}

export function currency(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(value);
}

export function prettyDate(value: string) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(value));
}

export function cutoffDate(period: Period) {
	if (period === 'all') return null;

	const months = Number(period);
	const now = new Date();
	const date = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
	return date;
}

export function filterTransactions(rows: TransactionRow[], period: Period) {
	const cutoff = cutoffDate(period);
	if (!cutoff) return rows;

	return rows.filter((row) => new Date(row.transaction_date) >= cutoff);
}

export function summarize(rows: TransactionRow[]): MetricSummary {
	const revenue = rows
		.filter((row) => row.type === 'REVENUE')
		.reduce((sum, row) => sum + toNumber(row.amount), 0);

	const expenses = rows
		.filter((row) => row.type === 'EXPENSE')
		.reduce((sum, row) => sum + toNumber(row.amount), 0);

	return {
		revenue,
		expenses,
		profit: revenue - expenses,
		count: rows.length
	};
}

export function monthlyBars(rows: TransactionRow[]): BarPoint[] {
	const map = new Map<string, BarPoint>();

	for (const row of rows) {
		const date = new Date(row.transaction_date);
		const label = date.toLocaleString('en-US', {
			month: 'short',
			year: '2-digit'
		});

		const current = map.get(label) ?? { label, revenue: 0, expenses: 0 };

		if (row.type === 'REVENUE') current.revenue += toNumber(row.amount);
		if (row.type === 'EXPENSE') current.expenses += toNumber(row.amount);

		map.set(label, current);
	}

	return [...map.values()];
}

export function categoryBreakdown(rows: TransactionRow[], type: 'EXPENSE' | 'REVENUE'): PiePoint[] {
	const map = new Map<string, number>();

	for (const row of rows.filter((item) => item.type === type)) {
		const key = row.category?.name ?? 'Uncategorized';
		map.set(key, (map.get(key) ?? 0) + toNumber(row.amount));
	}

	return [...map.entries()].map(([label, value]) => ({ label, value }));
}

export function periodLabel(period: Period) {
	if (period === 'all') return 'All time';
	if (period === '1') return 'Last 1 month';
	return `Last ${period} months`;
}