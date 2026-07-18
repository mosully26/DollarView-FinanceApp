import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Period, TransactionRow } from '$lib/types';
import { filterTransactions, periodLabel } from '$lib/utils';

const FREE_PERIODS: Period[] = ['1', '3', '6'];
const PREMIUM_PERIODS: Period[] = ['1', '3', '6', '9', '12', '24', '36', '48', '60', '72', 'all'];

function escapeCsv(value: unknown) {
	const stringValue = String(value ?? '');
	return `"${stringValue.replace(/"/g, '""')}"`;
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('plan, subscription_status')
		.eq('id', user.id)
		.maybeSingle();

	const plan = profile?.plan ?? 'free';
	const subscriptionStatus = profile?.subscription_status ?? 'inactive';
	const isPremium = plan === 'premium' && subscriptionStatus === 'active';

	if (!isPremium) {
		throw error(403, 'Premium subscription required to export reports.');
	}

	const requestedPeriod = (url.searchParams.get('period') as Period) || '12';
	const safePeriod: Period = PREMIUM_PERIODS.includes(requestedPeriod) ? requestedPeriod : '12';

	const { data: business } = await locals.supabase
		.from('businesses')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!business) {
		throw error(404, 'Business not found.');
	}

	const { data: transactions, error: transactionsError } = await locals.supabase
		.from('transactions')
		.select(
			'id,business_id,category_id,title,amount,type,vendor,notes,transaction_date,created_at,category:categories(id,name,type)'
		)
		.eq('business_id', business.id)
		.order('transaction_date', { ascending: false });

	if (transactionsError) {
		throw error(500, transactionsError.message);
	}

	const normalizedTransactions: TransactionRow[] =
		(transactions ?? []).map((row: any) => ({
			...row,
			category: Array.isArray(row.category) ? row.category[0] ?? null : row.category
		})) as TransactionRow[];

	const filteredTransactions = filterTransactions(normalizedTransactions, safePeriod);

	const revenue = filteredTransactions
		.filter((row) => row.type === 'REVENUE')
		.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

	const expenses = filteredTransactions
		.filter((row) => row.type === 'EXPENSE')
		.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

	const profit = revenue - expenses;
	const count = filteredTransactions.length;

	const summaryRows = [
		['Report', 'DollarView Financial Report'],
		['Business', business.name],
		['Period', periodLabel(safePeriod)],
		['Revenue', revenue.toFixed(2)],
		['Expenses', expenses.toFixed(2)],
		['Profit', profit.toFixed(2)],
		['Transactions', String(count)]
	];

	const transactionHeader = [
		'Title',
		'Type',
		'Category',
		'Amount',
		'Vendor',
		'Date',
		'Notes'
	];

	const transactionRows = filteredTransactions.map((row) => [
		row.title,
		row.type,
		row.category?.name ?? 'Uncategorized',
		Number(row.amount ?? 0).toFixed(2),
		row.vendor ?? '',
		row.transaction_date,
		row.notes ?? ''
	]);

	const csvLines = [
		...summaryRows.map((row) => row.map(escapeCsv).join(',')),
		'',
		transactionHeader.map(escapeCsv).join(','),
		...transactionRows.map((row) => row.map(escapeCsv).join(','))
	];

	const csv = csvLines.join('\n');
	const filename = `financial-report-${safePeriod}-${new Date().toISOString().slice(0, 10)}.csv`;

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};