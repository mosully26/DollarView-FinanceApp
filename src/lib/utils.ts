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

export function isPremiumUser(plan?: string | null, subscriptionStatus?: string | null) {
	return plan === 'premium' && subscriptionStatus === 'active';
}

export function cutoffDate(period: Period) {
	if (period === 'all') return null;

	const months = Number(period);
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
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

export function monthlyBars(rows: TransactionRow[], period: Period): BarPoint[] {
	if (period === 'all') {
		return allTimeBars(rows);
	}

	const months = Number(period);
	const now = new Date();
	const points: BarPoint[] = [];

	for (let i = months - 1; i >= 0; i--) {
		const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const month = bucketDate.getMonth();
		const year = bucketDate.getFullYear();

		const label = bucketDate.toLocaleString('en-US', {
			month: 'short',
			year: '2-digit'
		});

		const monthRows = rows.filter((row) => {
			const rowDate = new Date(row.transaction_date);
			return rowDate.getMonth() === month && rowDate.getFullYear() === year;
		});

		const revenue = monthRows
			.filter((row) => row.type === 'REVENUE')
			.reduce((sum, row) => sum + toNumber(row.amount), 0);

		const expenses = monthRows
			.filter((row) => row.type === 'EXPENSE')
			.reduce((sum, row) => sum + toNumber(row.amount), 0);

		points.push({
			label,
			revenue,
			expenses
		});
	}

	return points;
}

function allTimeBars(rows: TransactionRow[]): BarPoint[] {
	if (!rows.length) return [];

	const grouped = new Map<number, { revenue: number; expenses: number }>();

	for (const row of rows) {
		const date = new Date(row.transaction_date);
		const year = date.getFullYear();

		const current = grouped.get(year) ?? { revenue: 0, expenses: 0 };

		if (row.type === 'REVENUE') current.revenue += toNumber(row.amount);
		if (row.type === 'EXPENSE') current.expenses += toNumber(row.amount);

		grouped.set(year, current);
	}

	return [...grouped.entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([year, totals]) => ({
			label: String(year),
			revenue: totals.revenue,
			expenses: totals.expenses
		}));
}

export function categoryBreakdown(rows: TransactionRow[], type: 'EXPENSE' | 'REVENUE'): PiePoint[] {
	const map = new Map<string, number>();

	for (const row of rows.filter((item) => item.type === type)) {
		const key = row.category?.name ?? 'Uncategorized';
		map.set(key, (map.get(key) ?? 0) + toNumber(row.amount));
	}

	return [...map.entries()]
		.map(([label, value]) => ({ label, value }))
		.sort((a, b) => b.value - a.value);
}

export function periodLabel(period: Period) {
	if (period === 'all') return 'All time';
	if (period === '1') return 'Last 1 month';
	return `Last ${period} months`;
}